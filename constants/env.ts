// See details in @/components/client-env-injector
export const ENV_LOCALE =
	process.env.NEXT_PUBLIC_LOCALE ??
	(typeof window !== 'undefined' ? window.__ENV__.LOCALE : null) ??
	'en';

export const ENV_SUPABASE_URL = process.env.SUPABASE_URL;
export const ENV_SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

export const ENV_NEXT_IMAGE_CACHE_TIME = process.env.NEXT_IMAGE_CACHE_TIME
	? parseInt(process.env.NEXT_IMAGE_CACHE_TIME)
	: 31536000; // 1 year

export const ENV_MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
export const ENV_MINIO_ROOT_USER = process.env.MINIO_ROOT_USER;
export const ENV_MINIO_ROOT_PASSWORD = process.env.MINIO_ROOT_PASSWORD;
