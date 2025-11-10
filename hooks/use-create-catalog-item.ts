import { BookEntity, TreeNodeEntity, TreeNodeType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { createTreeNode } from '@/actions/tree-node';
import { getTranslations } from '@/i18n';
import { useGetBook } from '@/queries/book';
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

	if (!book) {
		return null;
	}

	return (type: TreeNodeType) => {
		if (parentTreeNodeId !== null && !expandedKeys.has(parentTreeNodeId)) {
			expandedKeys.add(parentTreeNodeId);
			setExpandedKeys(expandedKeys);
		}

		const promise = (async () => {
			const result = await createTreeNode({
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
					router.push(`/dashboard/${book.id}/${data.docId}`);
				}

				mutateTree(book.id, BOOK_CATALOG_MAP);
			})
			.catch((error) => {
				console.log(error);
			});

		return promise;
	};
};
