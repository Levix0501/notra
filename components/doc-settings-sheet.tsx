'use client';

import { DocEntity } from '@prisma/client';
import { create } from 'zustand';

import { getTranslations } from '@/i18n';
import { useGetDocMeta } from '@/queries/doc';
import { Nullable } from '@/types/common';

import { DocSettingsForm } from './doc-settings-form';
import { NotraSkeleton } from './notra-skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

type DocSettingsSheetStore = {
	open: boolean;
	setOpen: (open: boolean) => void;
	docId: Nullable<DocEntity['id']>;
	setDocId: (docId: DocEntity['id']) => void;
};

export const useDocSettingsSheet = create<DocSettingsSheetStore>((set) => ({
	open: false,
	setOpen: (open) => set({ open }),
	docId: null,
	setDocId: (docId) => set({ docId })
}));

const t = getTranslations('components_doc_settings_sheet');

export const DocSettingsSheet = () => {
	const { open, setOpen, docId } = useDocSettingsSheet();
	const { data: docMeta, isLoading, mutate } = useGetDocMeta(docId);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent
				onCloseAutoFocus={(e) => e.preventDefault()}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<SheetHeader>
					<SheetTitle>{t.doc_settings}</SheetTitle>
				</SheetHeader>

				<div className="px-4">
					{isLoading || !docId ? (
						<NotraSkeleton />
					) : (
						<DocSettingsForm
							bookId={docMeta?.bookId ?? 0}
							bookSlug={docMeta?.book?.slug ?? ''}
							defaultDocCover={docMeta?.cover ?? ''}
							defaultDocSlug={docMeta?.slug ?? ''}
							defaultDocSummary={docMeta?.summary ?? ''}
							docId={docMeta?.id ?? 0}
							mutateDocMeta={mutate}
						/>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
};
