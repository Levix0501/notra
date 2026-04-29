import { BookEntity, TreeNodeEntity, TreeNodeType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { createTreeNode } from '@/actions/tree-node';
import { useApp } from '@/contexts/app-context';
import { getTranslations } from '@/i18n';
import { useGetBook } from '@/queries/book';
import { DemoService } from '@/services/demo';
import {
	BOOK_CATALOG_MAP,
	mutateTree,
	useBookCatalogTree
} from '@/stores/tree';

interface UseCreateCatalogItemProps {
	bookId: BookEntity['id'];
	parentTreeNodeId: TreeNodeEntity['parentId'];
}

const t = getTranslations('hooks_use_create_catalog_item');

export const useCreateCatalogItem = ({
	bookId,
	parentTreeNodeId
}: UseCreateCatalogItemProps) => {
	const { data: book } = useGetBook(bookId);
	const expandedKeys = useBookCatalogTree((state) => state.expandedKeys);
	const setExpandedKeys = useBookCatalogTree((state) => state.setExpandedKeys);
	const router = useRouter();
	const { isDemo } = useApp();

	if (!book) {
		return null;
	}

	return (type: TreeNodeType) => {
		if (parentTreeNodeId !== null && !expandedKeys.has(parentTreeNodeId)) {
			expandedKeys.add(parentTreeNodeId);
			setExpandedKeys(expandedKeys);
		}

		const promise = (async () => {
			const result = isDemo
				? await DemoService.createTreeNode({
						parentId: parentTreeNodeId,
						type,
						bookId
					})
				: await createTreeNode({
						parentId: parentTreeNodeId,
						type,
						bookId
					});

			if (!result.success) {
				throw new Error(result.message);
			}

			return result.data;
		})();

		toast
			.promise(promise, {
				loading: t.create_loading,
				success: t.create_success,
				error: t.create_error
			})
			.unwrap()
			.then((data) => {
				if (type === 'DOC' && data?.docId) {
					router.push(
						`/${isDemo ? 'demo' : 'dashboard'}/${book.id}/${data.docId}`
					);
				}

				mutateTree(book.id, BOOK_CATALOG_MAP, isDemo);
			})
			.catch((error) => {
				console.log(error);
			});

		return promise;
	};
};
