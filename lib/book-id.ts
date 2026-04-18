/** Safe parsing for route/query book ids (avoids Prisma calls for `"null"`, NaN, etc.). */
export function parseBookId(bookId: unknown): number | null {
	if (bookId == null) {
		return null;
	}

	const s = String(bookId).trim().toLowerCase();

	if (s === '' || s === 'null' || s === 'undefined') {
		return null;
	}

	const n = Number(s);

	if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) {
		return null;
	}

	return n;
}
