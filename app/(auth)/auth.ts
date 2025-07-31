import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

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
				if (username === 'demo' && password === 'demo123') {
					return {
						id: 'demo'
					};
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
