import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
	hasNextPage: boolean;
	isLoading: boolean;
	onLoadMore: () => void;
	threshold?: number;
}

export const useInfiniteScroll = ({
	hasNextPage,
	isLoading,
	onLoadMore,
	threshold = 200
}: UseInfiniteScrollOptions) => {
	const observerRef = useRef<IntersectionObserver | null>(null);
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [target] = entries;

			if (target.isIntersecting && hasNextPage && !isLoading) {
				onLoadMore();
			}
		},
		[hasNextPage, isLoading, onLoadMore]
	);

	useEffect(() => {
		const element = sentinelRef.current;

		if (!element) return;

		observerRef.current = new IntersectionObserver(handleObserver, {
			rootMargin: `${threshold}px`
		});

		observerRef.current.observe(element);

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [handleObserver, threshold]);

	return sentinelRef;
};
