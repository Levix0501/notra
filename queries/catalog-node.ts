import { BookEntity } from '@prisma/client';
import { SWRConfiguration } from 'swr';

import { useFetcher } from '@/hooks/use-fetcher';
import { CatalogNodeVoWithLevel } from '@/types/catalog-node';
import { Nullable } from '@/types/common';

export const useGetCatalogNodes = (
	id: Nullable<BookEntity['id']>,
	config?: SWRConfiguration<CatalogNodeVoWithLevel[]>
) =>
	useFetcher<CatalogNodeVoWithLevel[]>(
		id ? `/api/catalog-nodes?book_id=${id}` : void 0,
		config
	);
