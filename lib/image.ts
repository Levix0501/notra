import { ENV_MINIO_ENDPOINT } from '@/constants/env';

const publicOrigin = () => {
	if (typeof window !== 'undefined') {
		return window.location.origin;
	}

	return (process.env.AUTH_URL ?? 'https://localhost').replace(/\/$/, '');
};

const ALLOWED_DOMAINS = [
	'supabase.co',
	...(ENV_MINIO_ENDPOINT ? [ENV_MINIO_ENDPOINT] : [])
];

export const isAllowedDomain = (src: string) => {
	if (!src) {
		return false;
	}

	try {
		const url = new URL(
			src,
			typeof window !== 'undefined'
				? window.location.origin
				: 'https://localhost'
		);

		if (url.hostname === 'localhost' || url.hostname.endsWith('.localhost')) {
			return false;
		}

		if (url.pathname.startsWith('/minio/')) {
			return false;
		}

		return ALLOWED_DOMAINS.some((domain) => url.hostname.endsWith(domain));
	} catch {
		return false;
	}
};

/**
 * Returns an absolute browser URL for MinIO-backed assets (fixes old DB rows
 * that stored `/minio/...` only and avoids Next image optimizer / private IP).
 */
/** Next metadata / OG must not point at loopback URLs — the optimizer rejects private IPs. */
export const isLoopbackImageUrl = (url: string) => {
	try {
		const u = new URL(url);
		const h = u.hostname.toLowerCase();

		return (
			h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1'
		);
	} catch {
		return false;
	}
};

export const normalizeStorageImageUrl = (src?: string | null) => {
	if (src == null) {
		return undefined;
	}

	const trimmed = String(src).trim();

	if (trimmed === '' || trimmed.toLowerCase() === 'null') {
		return undefined;
	}

	const base = publicOrigin();

	if (trimmed.startsWith('/minio/')) {
		return `${base}${trimmed}`;
	}

	try {
		const url = new URL(
			trimmed,
			typeof window !== 'undefined'
				? window.location.origin
				: 'https://localhost'
		);

		if (url.pathname.startsWith('/minio/')) {
			return `${base}${url.pathname}${url.search}${url.hash}`;
		}

		return trimmed;
	} catch {
		return trimmed;
	}
};
