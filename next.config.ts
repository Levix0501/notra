import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: '**.supabase.co'
			}
		],
		minimumCacheTTL: 2678400 // 31 days
	}
};

export default nextConfig;
