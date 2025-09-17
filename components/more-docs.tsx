'use client';

import { BookEntity } from '@prisma/client';
import { Loader2 } from 'lucide-react';

import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { getTranslations } from '@/i18n';
import { PAGE_SIZE, useGetMorePublishedDocMetaList } from '@/queries/doc';

import DocCard from './doc-card';

interface MoreDocsProps {
	bookSlug?: BookEntity['slug'];
	isEmpty: boolean;
}

const t = getTranslations('components_more_docs');

export const MoreDocs = ({ bookSlug, isEmpty }: Readonly<MoreDocsProps>) => {
	const { data, isLoading, size, setSize } =
		useGetMorePublishedDocMetaList(bookSlug);

	const docs = data?.flat() ?? [];
	const isLoadingMore =
		isLoading ||
		(size > 0 && data && typeof data[size - 1] === 'undefined') ||
		false;
	const isReachingEnd =
		isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE) || false;

	const sentinelRef = useInfiniteScroll({
		hasNextPage: !isReachingEnd,
		isLoading: isLoadingMore,
		onLoadMore: () => setSize((prev) => prev + 1),
		threshold: 200
	});

	return (
		<>
			{docs.map((doc) => (
				<DocCard key={doc.id} doc={doc} />
			))}

			<div ref={sentinelRef} className="col-span-full flex justify-center py-6">
				{!isReachingEnd && <Loader2 className="animate-spin" />}
				{(isEmpty || (isReachingEnd && !isLoading)) && (
					<div className="text-sm text-muted-foreground">{t.no_more}</div>
				)}
			</div>
		</>
	);
};
