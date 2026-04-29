'use client';

import { BookEntity } from '@prisma/client';
import { Loader2 } from 'lucide-react';

import { CARD_LIST_PAGE_SIZE } from '@/constants/pagination';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { getTranslations } from '@/i18n';
import { useGetPublishedBlogs } from '@/queries/doc';

import { BlogCard } from './blog-card';
import { EmptyState } from './empty-state';

interface MoreBlogsProps {
	bookId?: BookEntity['id'];
	totalCount: number;
}

const t = getTranslations('components_more_blogs');

export const MoreBlogs = ({ bookId, totalCount }: Readonly<MoreBlogsProps>) => {
	const { data, isLoading, size, setSize } = useGetPublishedBlogs(
		totalCount,
		bookId
	);

	const blogs = data?.flat() ?? [];
	const isLoadingMore =
		isLoading ||
		(size > 0 && data && typeof data[size - 1] === 'undefined') ||
		false;
	const isReachingEnd =
		totalCount <= CARD_LIST_PAGE_SIZE ||
		(data && data[data.length - 1]?.length < CARD_LIST_PAGE_SIZE) ||
		false;

	const sentinelRef = useInfiniteScroll({
		hasNextPage: !isReachingEnd,
		isLoading: isLoadingMore,
		onLoadMore: () => setSize((prev) => prev + 1),
		threshold: 200
	});

	return (
		<>
			{blogs.map((blog) => (
				<BlogCard key={blog.id} blog={blog} />
			))}

			<div ref={sentinelRef} className="col-span-full flex justify-center py-6">
				{!isReachingEnd && <Loader2 className="animate-spin" />}
				{totalCount !== 0 && isReachingEnd && !isLoading && (
					<div className="text-sm text-muted-foreground">{t.no_more}</div>
				)}
				{totalCount === 0 && <EmptyState content={t.no_blogs_found} />}
			</div>
		</>
	);
};
