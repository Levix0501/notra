'use client';

import { useEffect } from 'react';

import { revalidateAll } from '@/lib/cache';

export const AppRevalidator = () => {
	useEffect(() => {
		if (window.__ENV__?.IS_DOCKER) {
			revalidateAll().then(() => {
				location.reload();
			});
		}
	}, []);

	return null;
};
