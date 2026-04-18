type SessionLike = {
	user?: {
		id?: string;
		role?: string;
	};
} | null;

/** Admin-only operations (comment moderation APIs, etc.). */
export function isAdminSession(session: SessionLike): boolean {
	return session?.user?.role === 'ADMIN';
}
