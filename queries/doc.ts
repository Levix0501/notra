import { BookEntity, DocEntity } from '@prisma/client';
import { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';

import { CARD_LIST_PAGE_SIZE } from '@/constants/pagination';
import { useFetcher } from '@/hooks/use-fetcher';
import { fetcher } from '@/lib/fetcher';
import { Nullable } from '@/types/common';
import { DocMetaVo, DocVo, PublishedDocMetaVo } from '@/types/doc';

export const useGetPublishedDocMeta = (docId?: DocEntity['id']) =>
	useFetcher<PublishedDocMetaVo>(
		docId ? `/api/public/docs/${docId}/meta` : void 0,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false
		}
	);

export const useGetFirstPagePublishedDocsMeta = (bookId?: BookEntity['id']) => {
	const params = new URLSearchParams();

	if (bookId) {
		params.set('book_id', bookId.toString());
	}

	params.set('page', '1');
	params.set('page_size', CARD_LIST_PAGE_SIZE.toString());

	return useFetcher<PublishedDocMetaVo[]>(
		`/api/public/docs/meta?${params.toString()}`,
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
		fetcher<PublishedDocMetaVo[]>,
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
