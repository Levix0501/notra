import { BookEntity } from '@prisma/client';
import { SWRConfiguration } from 'swr';

import { useFetcher } from '@/hooks/use-fetcher';
import { CatalogNodeVoWithLevel } from '@/types/catalog-node';

export const useGetCatalogNodes = (
	id: BookEntity['id'],
	config?: SWRConfiguration<CatalogNodeVoWithLevel[]>
) =>
	useFetcher<CatalogNodeVoWithLevel[]>(
		id ? `/api/catalog-nodes?book_id=${id}` : void 0,
		config
	);
