import { WrappedResponse } from '@/types/common';

export const fetcher = async <T = unknown>(path: string) => {
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	const response = await fetch(normalizedPath);

	if (!response.ok) {
		throw new Error(`Failed to fetch ${normalizedPath}`);
	}

	const result = (await response.json()) as WrappedResponse<T>;

	if (!result.success) {
		throw new Error(result.message);
	}

	return result.data;
};
