import { BookEntity, DocEntity } from '@prisma/client';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';

import { CARD_LIST_PAGE_SIZE } from '@/constants/pagination';
import { useApp } from '@/contexts/app-context';
import { useFetcher } from '@/hooks/use-fetcher';
import { fetcher } from '@/lib/fetcher';
import { DemoService } from '@/services/demo';
import { Nullable } from '@/types/common';
import { DocMetaVo, DocVo, PublishedBlogVo } from '@/types/doc';

export const useGetPublishedBlog = (docId?: DocEntity['id']) =>
	useFetcher<PublishedBlogVo>(
		docId ? `/api/public/docs/blogs/${docId}` : void 0,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false
		}
	);

export const useGetFirstPagePublishedBlogs = (bookId?: BookEntity['id']) => {
	const params = new URLSearchParams();

	if (bookId) {
		params.set('book_id', bookId.toString());
	}

	params.set('page', '1');
	params.set('page_size', CARD_LIST_PAGE_SIZE.toString());

	return useFetcher<PublishedBlogVo[]>(
		`/api/public/docs/blogs?${params.toString()}`,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false
		}
	);
};

export const useGetPublishedBlogs = (
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

			return `/api/public/docs/blogs?${params.toString()}`;
		},
		fetcher<PublishedBlogVo[]>,
		{
			revalidateFirstPage: false
		}
	);
};

export const useGetDocMeta = (
	docId: Nullable<DocEntity['id']>,
	config?: SWRConfiguration<DocMetaVo>
) => {
	const { isDemo } = useApp();
	const demo = useSWR(
		isDemo && docId ? `/demo/docs/${docId}/meta` : void 0,
		() => DemoService.getDocMeta(docId!),
		config
	);
	const api = useFetcher<DocMetaVo>(
		!isDemo && docId ? `/api/docs/${docId}/meta` : void 0,
		config
	);

	return isDemo ? demo : api;
};

export const useGetDoc = (docId: DocEntity['id']) => {
	const { isDemo } = useApp();
	const demo = useSWR(isDemo ? `/demo/docs/${docId}` : void 0, () =>
		DemoService.getDoc(docId)
	);
	const api = useFetcher<DocVo>(isDemo ? void 0 : `/api/docs/${docId}`);

	return isDemo ? demo : api;
};

export const useGetAllDocsMeta = () =>
	useFetcher<DocMetaVo[]>('/api/docs/meta');
