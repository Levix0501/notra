import { BookEntity, DocEntity } from '@prisma/client';
import { SWRConfiguration } from 'swr';

import { useFetcher } from '@/hooks/use-fetcher';
import { Nullable } from '@/types/common';
import { DocMetaVo } from '@/types/doc';

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
