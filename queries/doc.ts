import { BookEntity, DocEntity } from '@prisma/client';
import { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';

import { useFetcher } from '@/hooks/use-fetcher';
import { fetcher } from '@/lib/fetcher';
import { Nullable } from '@/types/common';
import { DocMetaVo, DocVo, PublishedDocViewsVo } from '@/types/doc';

export const useGetPublishedDocViews = (docId?: DocEntity['id']) =>
	useFetcher<PublishedDocViewsVo>(
		docId ? `/api/public/docs/${docId}/views` : void 0,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false
		}
	);

export const useGetPublishedDocsViews = ({
	bookId,
	page,
	pageSize
}: {
	bookId?: BookEntity['id'];
	page: number;
	pageSize: number;
}) => {
	const params = new URLSearchParams();

	if (bookId) {
		params.set('book_id', bookId.toString());
	}

	params.set('page', page.toString());
	params.set('page_size', pageSize.toString());

	return useFetcher<PublishedDocViewsVo[]>(
		`/api/public/docs/views?${params.toString()}`,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false
		}
	);
};

export const useGetDocMeta = (
	{
		bookId,
		docId
	}: {
		bookId: Nullable<BookEntity['id']>;
		docId: Nullable<DocEntity['id']>;
	},
	config?: SWRConfiguration<DocMetaVo>
) =>
	useFetcher<DocMetaVo>(
		bookId && docId
			? `/api/docs/meta?book_id=${bookId}&doc_id=${docId}`
			: void 0,
		config
	);

export const useGetDoc = ({
	bookId,
	docId
}: {
	bookId: BookEntity['id'];
	docId: DocEntity['id'];
}) => useFetcher<DocVo>(`/api/docs?book_id=${bookId}&doc_id=${docId}`);

export const PAGE_SIZE = 24;

export const useGetMorePublishedDocMetaList = (
	totalCount: number,
	bookId?: BookEntity['id']
) => {
	return useSWRInfinite(
		(pageIndex, previousPageData) => {
			if (
				(previousPageData && !previousPageData.length) ||
				totalCount <= PAGE_SIZE
			) {
				return null;
			}

			const params = new URLSearchParams();

			if (bookId) {
				params.set('book_id', bookId.toString());
			}

			params.set('page', (pageIndex + 2).toString());
			params.set('page_size', PAGE_SIZE.toString());

			return `/api/docs/meta?${params.toString()}`;
		},
		fetcher<DocMetaVo[]>,
		{
			revalidateFirstPage: false
		}
	);
};
