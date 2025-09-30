import { ENV_MINIO_ENDPOINT, ENV_NEXT_IMAGE_CACHE_TIME } from './constants/env';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				hostname: '**.supabase.co'
			},
			...(ENV_MINIO_ENDPOINT
				? [
						{
							hostname: ENV_MINIO_ENDPOINT
						}
					]
				: [])
		],
		minimumCacheTTL: ENV_NEXT_IMAGE_CACHE_TIME
	}
};

export default nextConfig;
