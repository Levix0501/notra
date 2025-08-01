import useSWR, { SWRConfiguration } from 'swr';

import { fetcher } from '@/lib/fetcher';

export const useFetcher = <T>(path?: string, config?: SWRConfiguration<T>) => {
	return useSWR(path, fetcher<T>, config);
};
