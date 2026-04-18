import { NextAuthConfig } from 'next-auth';

export const authConfig = {
	pages: {
		signIn: '/login'
	},
	providers: [
		// added later in auth.ts since it requires bcrypt which is only compatible with Node.js
		// while this file is also used in non-Node.js environments
	],
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const pathname = nextUrl.pathname;

			const isOnDashboard = pathname.startsWith('/dashboard');
			const isOnLogin = pathname.startsWith('/login');
			const isLoggedIn = !!auth?.user;

			if (isOnLogin && isLoggedIn) {
				const rawCallback = nextUrl.searchParams.get('callbackUrl');
				let path = '/dashboard';

				if (rawCallback) {
					try {
						const target = new URL(rawCallback, nextUrl);

						if (target.origin === nextUrl.origin) {
							path = `${target.pathname}${target.search}${target.hash}`;
						}
					} catch {
						// ignore invalid callbackUrl
					}
				}

				return Response.redirect(new URL(path, nextUrl));
			}

			if (isOnDashboard && !isLoggedIn) {
				let callbackUrl = pathname;

				if (nextUrl.search) {
					callbackUrl += nextUrl.search;
				}

				const encodedCallbackUrl = encodeURIComponent(callbackUrl);

				return Response.redirect(
					new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
				);
			}

			return true;
		}
	},
	trustHost: true
} satisfies NextAuthConfig;
