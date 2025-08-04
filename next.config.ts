import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: '**.supabase.co'
			}
		]
	}
};

export default nextConfig;
