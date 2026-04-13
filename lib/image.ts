import { ENV_MINIO_ENDPOINT } from '@/constants/env';

const ALLOWED_DOMAINS = [
	'supabase.co',
	...(ENV_MINIO_ENDPOINT ? [ENV_MINIO_ENDPOINT] : [])
];

export const isAllowedDomain = (src: string) => {
	const url = new URL(src);

	return ALLOWED_DOMAINS.some((domain) => url.hostname.endsWith(domain));
};

export const normalizeStorageImageUrl = (src?: string | null) => {
	if (!src) return src;

	if (src.startsWith('/minio/')) return src;

	try {
		const url = new URL(src);

		if (url.pathname.startsWith('/minio/')) {
			return `${url.pathname}${url.search}${url.hash}`;
		}

		return src;
	} catch {
		return src;
	}
};
