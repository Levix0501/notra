const ALLOWED_DOMAINS = ['supabase.co'];

export const isAllowedDomain = (src: string) => {
	const url = new URL(src);

	return ALLOWED_DOMAINS.some((domain) => url.hostname.endsWith(domain));
};
