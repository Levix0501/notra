'use client';

import { BookEntity, TreeNodeEntity } from '@prisma/client';
import { create } from 'zustand';

import { getTranslations } from '@/i18n';
import { CONTACT_INFO_MAP } from '@/stores/tree';
import { Nullable } from '@/types/common';

import { ContactInfoForm } from './contact-info-form';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

type ContactInfoSheetStore = {
	open: boolean;
	setOpen: (open: boolean) => void;
	id: Nullable<TreeNodeEntity['id']>;
	setId: (id: Nullable<TreeNodeEntity['id']>) => void;
};

export const useContactInfoSheet = create<ContactInfoSheetStore>((set) => ({
	open: false,
	setOpen: (open) => set({ open }),
	id: null,
	setId: (id) => set({ id })
}));

const t = getTranslations('components_contact_info_sheet');

export const ContactInfoSheet = ({ bookId }: { bookId: BookEntity['id'] }) => {
	const open = useContactInfoSheet((state) => state.open);
	const setOpen = useContactInfoSheet((state) => state.setOpen);
	const id = useContactInfoSheet((state) => state.id);

	const node = id ? CONTACT_INFO_MAP.get(id) : null;
	const defaultUrl = node?.url;
	const defaultIcon = node?.icon;

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent
				onCloseAutoFocus={(e) => e.preventDefault()}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<SheetHeader>
					<SheetTitle>
						{id ? t.edit_contact_info : t.add_contact_info}
					</SheetTitle>
				</SheetHeader>

				<div className="px-4">
					<ContactInfoForm
						bookId={bookId}
						defaultIcon={defaultIcon}
						defaultUrl={defaultUrl}
						id={id}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
};
