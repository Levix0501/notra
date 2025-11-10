'use client';

import { BookEntity, TreeNodeEntity } from '@prisma/client';
import { create } from 'zustand';

import { getTranslations } from '@/i18n';
import { NAVBAR_MAP } from '@/stores/tree';
import { Nullable } from '@/types/common';

import { NavItemForm } from './nav-item-form';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

type NavItemSheetStore = {
	open: boolean;
	setOpen: (open: boolean) => void;
	id: Nullable<TreeNodeEntity['id']>;
	setId: (id: Nullable<TreeNodeEntity['id']>) => void;
	parentTreeNodeId: TreeNodeEntity['parentId'];
	setParentTreeNodeId: (parentTreeNodeId: TreeNodeEntity['parentId']) => void;
};

export const useNavItemSheet = create<NavItemSheetStore>((set) => ({
	open: false,
	setOpen: (open) => set({ open }),
	id: null,
	setId: (id) => set({ id }),
	parentTreeNodeId: null,
	setParentTreeNodeId: (parentTreeNodeId) => set({ parentTreeNodeId })
}));

const t = getTranslations('components_nav_item_sheet');

export const NavItemSheet = ({ bookId }: { bookId: BookEntity['id'] }) => {
	const open = useNavItemSheet((state) => state.open);
	const setOpen = useNavItemSheet((state) => state.setOpen);
	const parentTreeNodeId = useNavItemSheet((state) => state.parentTreeNodeId);
	const id = useNavItemSheet((state) => state.id);

	const node = id ? NAVBAR_MAP.get(id) : null;
	const defaultTitle = node?.title;
	const defaultType = node?.type;
	const defaultUrl = node?.url;
	const defaultIsExternal = node?.isExternal;

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent
				onCloseAutoFocus={(e) => e.preventDefault()}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<SheetHeader>
					<SheetTitle>{id ? t.edit_navbar_item : t.add_navbar_item}</SheetTitle>
				</SheetHeader>

				<div className="px-4">
					<NavItemForm
						bookId={bookId}
						defaultIsExternal={defaultIsExternal}
						defaultTitle={defaultTitle}
						defaultType={defaultType}
						defaultUrl={defaultUrl}
						id={id}
						parentTreeNodeId={parentTreeNodeId}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
};
