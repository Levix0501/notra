import { BookEntity, DocEntity } from '@prisma/client';
import { SWRConfiguration } from 'swr';

import { useFetcher } from '@/hooks/use-fetcher';
import { Nullable } from '@/types/common';
import { DocMetaVo, DocVo } from '@/types/doc';

export const useGetDocMeta = (
	{
		book,
		doc
	}: {
		book?: Nullable<BookEntity['slug']>;
		doc?: Nullable<DocEntity['slug']>;
	},
	config?: SWRConfiguration<DocMetaVo>
) =>
	useFetcher<DocMetaVo>(
		book && doc ? `/api/docs/meta?book_slug=${book}&doc_slug=${doc}` : void 0,
		config
	);

export const useGetDoc = ({
	book,
	doc
}: {
	book?: Nullable<BookEntity['slug']>;
	doc?: Nullable<DocEntity['slug']>;
}) =>
	useFetcher<DocVo>(
		book && doc ? `/api/docs?book_slug=${book}&doc_slug=${doc}` : void 0
	);

export const useGetPublishedDocMetaList = (
	{
		book,
		page = 1,
		pageSize = 12
	}: {
		book?: Nullable<BookEntity['slug']>;
		page?: number;
		pageSize?: number;
	},
	config?: SWRConfiguration<DocMetaVo[]>
) =>
	useFetcher<DocMetaVo[]>(
		book
			? `/api/docs/meta/list?book_slug=${book}&page=${page}&page_size=${pageSize}`
			: void 0,
		config
	);
