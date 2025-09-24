export const ENV_LOCALE = process.env.NEXT_PUBLIC_LOCALE ?? 'en';

export const ENV_SUPABASE_URL = process.env.SUPABASE_URL;
export const ENV_SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

export const ENV_NEXT_IMAGE_CACHE_TIME = process.env.NEXT_IMAGE_CACHE_TIME
	? parseInt(process.env.NEXT_IMAGE_CACHE_TIME)
	: 31536000; // 1 year
