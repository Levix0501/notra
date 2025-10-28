import { BookEntity } from '@prisma/client';
import { SWRConfiguration } from 'swr';

import { useFetcher } from '@/hooks/use-fetcher';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

export const useGetTreeNodes = (
	bookId: BookEntity['id'] | undefined,
	config?: SWRConfiguration<TreeNodeVoWithLevel[]>
) =>
	useFetcher<TreeNodeVoWithLevel[]>(
		bookId ? `/api/tree-nodes/${bookId}` : void 0,
		config
	);
