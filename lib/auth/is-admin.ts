/**
 * Admin access for API routes (comments moderation, etc.).
 *
 * The app uses a single Credentials account (`AccountEntity` id `default`).
 * There is no separate `role` column: any authenticated session is treated as
 * admin when `session.user.role` is absent (see fallback below).
 */

type SessionLike = {
	user?: {
		id?: string;
		role?: string;
	};
} | null;

export function isAdminSession(session: SessionLike): boolean {
	if (!session?.user) {
		return false;
	}

	if (session.user.role) {
		return session.user.role === 'admin';
	}

	// Backward-compatible fallback for current single-admin auth model.
	return Boolean(session.user.id);
}
