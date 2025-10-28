'use client';

import { BookEntity, TreeNodeEntity } from '@prisma/client';
import { toast } from 'sonner';
import { create } from 'zustand';

import { deleteNodeWithChildren } from '@/actions/tree-node';
import { getTranslations } from '@/i18n';
import { deleteNode } from '@/lib/tree/client';
import { mutateTree, nodeMap } from '@/stores/tree';
import { Nullable } from '@/types/common';

import { NotraAlertDialog } from './notra-alert-dialog';

type NavItemDeleteDialogStore = {
	open: boolean;
	setOpen: (open: boolean) => void;
	id: Nullable<TreeNodeEntity['id']>;
	setId: (id: Nullable<TreeNodeEntity['id']>) => void;
};

export const useNavItemDeleteDialog = create<NavItemDeleteDialogStore>(
	(set) => ({
		open: false,
		setOpen: (open) => set({ open }),
		id: null,
		setId: (id) => set({ id })
	})
);

const t = getTranslations('components_nav_item_delete_dialog');

export const NavItemDeleteDialog = ({
	bookId
}: {
	bookId: BookEntity['id'];
}) => {
	const open = useNavItemDeleteDialog((state) => state.open);
	const setOpen = useNavItemDeleteDialog((state) => state.setOpen);
	const id = useNavItemDeleteDialog((state) => state.id);

	const handleDelete = () => {
		if (!id) {
			return;
		}

		const [nodeIds, docIds] = deleteNode(nodeMap, id);

		mutateTree(bookId, async () => {
			const promise = (async () => {
				const result = await deleteNodeWithChildren({
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
		});
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
