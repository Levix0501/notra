'use client';

import { BookEntity, TreeNodeEntity } from '@prisma/client';
import { toast } from 'sonner';
import { create } from 'zustand';

import { deleteTreeNodeWithChildren } from '@/actions/tree-node';
import { getTranslations } from '@/i18n';
import { deleteNode } from '@/lib/tree/client';
import { CONTACT_INFO_MAP, mutateTree, NAVBAR_MAP } from '@/stores/tree';
import { Nullable } from '@/types/common';

import { NotraAlertDialog } from './notra-alert-dialog';

type TreeNodeDeleteDialogStore = {
	open: boolean;
	setOpen: (open: boolean) => void;
	id: Nullable<TreeNodeEntity['id']>;
	setId: (id: Nullable<TreeNodeEntity['id']>) => void;
	bookId: Nullable<BookEntity['id']>;
	setBookId: (bookId: Nullable<BookEntity['id']>) => void;
	type: 'navbar' | 'contact';
	setType: (type: 'navbar' | 'contact') => void;
};

export const useTreeNodeDeleteDialog = create<TreeNodeDeleteDialogStore>(
	(set) => ({
		open: false,
		setOpen: (open) => set({ open }),
		id: null,
		setId: (id) => set({ id }),
		bookId: null,
		setBookId: (bookId) => set({ bookId }),
		type: 'navbar',
		setType: (type) => set({ type })
	})
);

const t = getTranslations('components_tree_node_delete_dialog');

export const TreeNodeDeleteDialog = () => {
	const open = useTreeNodeDeleteDialog((state) => state.open);
	const setOpen = useTreeNodeDeleteDialog((state) => state.setOpen);
	const id = useTreeNodeDeleteDialog((state) => state.id);
	const bookId = useTreeNodeDeleteDialog((state) => state.bookId);
	const type = useTreeNodeDeleteDialog((state) => state.type);

	const handleDelete = () => {
		if (!id || !bookId) {
			return;
		}

		const [nodeIds, docIds] = deleteNode(
			type === 'navbar' ? NAVBAR_MAP : CONTACT_INFO_MAP,
			id
		);

		mutateTree(
			bookId,
			type === 'navbar' ? NAVBAR_MAP : CONTACT_INFO_MAP,
			false,
			async () => {
				const promise = (async () => {
					const result = await deleteTreeNodeWithChildren({
						nodeId: id,
						nodeIds,
						docIds,
						bookId: bookId
					});

					if (!result.success || !result.data) {
						throw new Error(result.message);
					}

					return result.data;
				})();

				return await toast
					.promise(promise, {
						loading: t.delete_loading,
						success: t.delete_success,
						error: t.delete_error
					})
					.unwrap();
			}
		);
	};

	return (
		<NotraAlertDialog
			cancelText={t.cancel}
			confirmText={t.confirm}
			description={t.description}
			open={open}
			title={t.title}
			onConfirm={handleDelete}
			onOpenChange={setOpen}
		/>
	);
};
