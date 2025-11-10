import { BookEntity } from '@prisma/client';
import { useRef } from 'react';
import { SWRConfiguration } from 'swr';

import { useFetcher } from '@/hooks/use-fetcher';
import {
	CONTACT_INFO_MAP,
	NAVBAR_MAP,
	setTreeNodeMap,
	useContactInfoTree,
	useNavbarTree
} from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

export const useGetTreeNodes = (
	bookId: BookEntity['id'] | undefined,
	config?: SWRConfiguration<TreeNodeVoWithLevel[]>
) =>
	useFetcher<TreeNodeVoWithLevel[]>(
		bookId ? `/api/tree-nodes/${bookId}` : void 0,
		config
	);

export const useGetNavbarTreeNodes = (bookId: BookEntity['id']) => {
	const hasDefaultExpandedKeysGenerated = useRef(false);

	const setExpandedKeys = useNavbarTree((state) => state.setExpandedKeys);

	return useGetTreeNodes(bookId, {
		onSuccess(data) {
			setTreeNodeMap(NAVBAR_MAP, data);

			if (data && !hasDefaultExpandedKeysGenerated.current) {
				hasDefaultExpandedKeysGenerated.current = true;
				const defaultExpandedKeys = data
					.filter((node) => node.level === 0)
					.map((node) => node.id);

				setExpandedKeys(defaultExpandedKeys);
			}
		}
	});
};

export const useGetContactInfoTreeNodes = (bookId: BookEntity['id']) => {
	const hasDefaultExpandedKeysGenerated = useRef(false);

	const setExpandedKeys = useContactInfoTree((state) => state.setExpandedKeys);

	return useGetTreeNodes(bookId, {
		onSuccess(data) {
			setTreeNodeMap(CONTACT_INFO_MAP, data);

			if (data && !hasDefaultExpandedKeysGenerated.current) {
				hasDefaultExpandedKeysGenerated.current = true;
				const defaultExpandedKeys = data
					.filter((node) => node.level === 0)
					.map((node) => node.id);

				setExpandedKeys(defaultExpandedKeys);
			}
		}
	});
};
