import { compare } from 'bcrypt-ts';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import prisma from '@/lib/prisma';
import { AccountService } from '@/services/account';

import { authConfig } from './auth.config';

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut
} = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			credentials: {
				username: {},
				password: {}
			},
			async authorize({ username, password }) {
				const u = username as string | undefined;
				const p = password as string | undefined;

				if (!u || !p) {
					return null;
				}

				const anyUser = await AccountService.hasAnyUser();

				if (!anyUser) {
					const result = await AccountService.createFirstAdmin(u, p);

					if (!result.success || !result.data) {
						return null;
					}

					const created = result.data;

					return {
						id: created.id,
						name: created.username,
						role: created.role,
						image: created.image
					};
				}

				const found = (await AccountService.findUserByUsername(u)).data;

				if (!found) {
					return null;
				}

				const passwordsMatch = await compare(p, found.password);

				if (!passwordsMatch) {
					return null;
				}

				return {
					id: found.id,
					name: found.username,
					role: found.role,
					image: found.image
				};
			}
		})
	],
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.picture = user.image ?? undefined;
			}

			// Client `update({ image })` passes this; also ensures picture updates even if DB read races.
			if (
				trigger === 'update' &&
				session &&
				typeof session === 'object' &&
				'image' in session
			) {
				const img = (session as { image?: string | null }).image;

				if (img !== undefined) {
					token.picture = img ?? undefined;
				}
			}

			if (token.id && (trigger === 'update' || token.role === undefined)) {
				const row = await prisma.user.findUnique({
					where: { id: token.id as string },
					select: { role: true, image: true }
				});

				if (row) {
					token.role = row.role;
					token.picture = row.image ?? undefined;
				}
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.role = (token.role as string) ?? 'USER';
				session.user.image = token.picture ?? null;
			}

			return session;
		}
	}
});
