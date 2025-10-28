import { BookEntity, TreeNodeEntity, TreeNodeType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { createTreeNode } from '@/actions/tree-node';
import { getTranslations } from '@/i18n';
import { useGetBook } from '@/queries/book';
import { useTree, mutateTree } from '@/stores/tree';

interface UseCreateTreeNodeProps {
	bookId: BookEntity['id'];
	parentTreeNodeId: TreeNodeEntity['parentId'];
}

const t = getTranslations('hooks_use_create_tree_node');

export const useCreateTreeNode = ({
	bookId,
	parentTreeNodeId
}: UseCreateTreeNodeProps) => {
	const { data: book } = useGetBook(bookId);
	const expandedKeys = useTree((state) => state.expandedKeys);
	const setExpandedKeys = useTree((state) => state.setExpandedKeys);
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

				mutateTree(book.id);
			})
			.catch((error) => {
				console.log(error);
			});

		return promise;
	};
};
