import { ENV_NEXT_IMAGE_CACHE_TIME } from './constants/env';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: '**.supabase.co'
			}
		],
		minimumCacheTTL: ENV_NEXT_IMAGE_CACHE_TIME
	}
};

export default nextConfig;
