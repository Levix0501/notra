import { BookEntity } from '@prisma/client';
import { useRef } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

import { useApp } from '@/contexts/app-context';
import { useFetcher } from '@/hooks/use-fetcher';
import { DemoService } from '@/services/demo';
import {
	CONTACT_INFO_MAP,
	NAVBAR_MAP,
	setTreeNodeMap,
	useContactInfoTree,
	useNavbarTree
} from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

export const useGetTreeNodes = (
	bookId: BookEntity['id'],
	config?: SWRConfiguration<TreeNodeVoWithLevel[]>
) => {
	const { isDemo } = useApp();
	const demo = useSWR(
		isDemo ? `/demo/tree-nodes/${bookId}` : void 0,
		() => DemoService.getTreeNodesByBookId(bookId),
		config
	);
	const api = useFetcher<TreeNodeVoWithLevel[]>(
		isDemo ? void 0 : `/api/tree-nodes/${bookId}`,
		config
	);

	return isDemo ? demo : api;
};

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
