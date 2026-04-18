import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';

export const config = {
	// Include `/dashboard` and `/login` explicitly — `:path*` alone can miss the bare path.
	matcher: [
		'/dashboard',
		'/dashboard/:path*',
		'/login',
		'/login/:path*',
		'/api/auth/:path*'
	]
};

export default NextAuth(authConfig).auth;
