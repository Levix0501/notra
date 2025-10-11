import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				hostname: '**.supabase.co'
			},
			{
				hostname: '__CADDY_DOMAIN__' // do not change this, is will be replaced by the Caddy domain in the entrypoint.sh script
			}
		],
		minimumCacheTTL: 60 * 60 * 24 * 365
	}
};

export default nextConfig;
