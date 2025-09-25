import { BookEntity, DocEntity } from '@prisma/client';
import { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';

import { CARD_LIST_PAGE_SIZE } from '@/constants/pagination';
import { useFetcher } from '@/hooks/use-fetcher';
import { fetcher } from '@/lib/fetcher';
import { Nullable } from '@/types/common';
import {
	DocMetaVo,
	DocVo,
	PublishedDocsMetaVo,
	PublishedDocViewsVo
} from '@/types/doc';

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

export const useGetPublishedDocsMeta = (
	totalCount: number,
	bookId?: BookEntity['id']
) => {
	return useSWRInfinite(
		(pageIndex, previousPageData) => {
			if (
				(previousPageData && !previousPageData.length) ||
				totalCount <= CARD_LIST_PAGE_SIZE
			) {
				return null;
			}

			const params = new URLSearchParams();

			if (bookId) {
				params.set('book_id', bookId.toString());
			}

			params.set('page', (pageIndex + 2).toString());
			params.set('page_size', CARD_LIST_PAGE_SIZE.toString());

			return `/api/public/docs/meta?${params.toString()}`;
		},
		fetcher<PublishedDocsMetaVo[]>,
		{
			revalidateFirstPage: false
		}
	);
};

export const useGetDocMeta = (
	docId: Nullable<DocEntity['id']>,
	config?: SWRConfiguration<DocMetaVo>
) => useFetcher<DocMetaVo>(docId ? `/api/docs/${docId}/meta` : void 0, config);

export const useGetDoc = (docId: DocEntity['id']) =>
	useFetcher<DocVo>(`/api/docs/${docId}`);
