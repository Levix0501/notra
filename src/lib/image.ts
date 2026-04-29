import { ENV_MINIO_ENDPOINT } from '@/constants/env';

const ALLOWED_DOMAINS = [
	'supabase.co',
	...(ENV_MINIO_ENDPOINT ? [ENV_MINIO_ENDPOINT] : [])
];

export const isAllowedDomain = (src: string) => {
	const url = new URL(src);

	return ALLOWED_DOMAINS.some((domain) => url.hostname.endsWith(domain));
};
