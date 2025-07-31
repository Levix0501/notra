import { compare } from 'bcrypt-ts';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

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
				const account = (await AccountService.getAccount()).data;

				if (!account) {
					const result = await AccountService.createAccount(
						username as string,
						password as string
					);

					if (result.success) {
						return result.data;
					}

					return null;
				}

				if (account.username !== username) {
					return null;
				}

				const passwordsMatch = await compare(
					password as string,
					account.password
				);

				if (passwordsMatch) {
					return account;
				}

				return null;
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
			}

			return session;
		}
	}
});
