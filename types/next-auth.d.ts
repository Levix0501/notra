import type { DefaultSession } from 'next-auth';

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			role: string;
		} & DefaultSession['user'];
	}

	interface User {
		id: string;
		role: string;
		image?: string | null;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id?: string;
		role?: string;
		picture?: string;
	}
}
