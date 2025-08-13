'use client';

import { BookText, FileSliders } from 'lucide-react';
import { create } from 'zustand';

import { getTranslations } from '@/i18n';
import { useGetBook } from '@/queries/book';
import { useGetDocMeta } from '@/queries/doc';

import BookInfoForm from './book-info-form';
import DocSettingsForm from './doc-settings-form';
import {
	CloseButton,
	SettingsDialog,
	SettingsTabs,
	SettingsTabsContent,
	SettingsTabsList,
	SettingsTabsTrigger
} from './notra-settings';
import NotraSkeleton from './notra-skeleton';

type BookSettingsDialogStore = {
	tab: 'book' | 'doc';
	setTab: (tab: 'book' | 'doc') => void;
	slug: string;
	setSlug: (slug: string) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	docSlug: string;
	setDocSlug: (docSlug: string) => void;
};

export const useBookSettingsDialog = create<BookSettingsDialogStore>((set) => ({
	tab: 'book',
	setTab: (tab) => set({ tab }),
	slug: '',
	setSlug: (slug) => set({ slug }),
	open: false,
	setOpen: (open) =>
		set({ open, ...(open ? void 0 : { tab: 'book', docSlug: '' }) }),
	docSlug: '',
	setDocSlug: (docSlug) => set({ docSlug })
}));

const t = getTranslations('components_book_settings_dialog');

export default function BookSettingsDialog() {
	const tab = useBookSettingsDialog((state) => state.tab);
	const slug = useBookSettingsDialog((state) => state.slug);
	const open = useBookSettingsDialog((state) => state.open);
	const docSlug = useBookSettingsDialog((state) => state.docSlug);
	const setOpen = useBookSettingsDialog((state) => state.setOpen);
	const {
		data: book,
		mutate: mutateBook,
		isLoading: isBookLoading
	} = useGetBook(slug);
	const {
		data: docMeta,
		mutate: mutateDocMeta,
		isLoading: isDocMetaLoading
	} = useGetDocMeta(docSlug);

	return (
		<SettingsDialog open={open} onOpenChange={setOpen}>
			<SettingsTabs defaultValue={tab}>
				<SettingsTabsList>
					<CloseButton onClick={() => setOpen(false)} />
					<SettingsTabsTrigger value="book">
						<BookText />
						<div className="flex-1">
							<span className="truncate">{t.book_settings}</span>
						</div>
					</SettingsTabsTrigger>
					{docSlug && (
						<SettingsTabsTrigger value="doc">
							<FileSliders />
							<div className="flex-1">
								<span className="truncate">{t.doc_settings}</span>
							</div>
						</SettingsTabsTrigger>
					)}
				</SettingsTabsList>

				<SettingsTabsContent value="book">
					{isBookLoading ? (
						<NotraSkeleton />
					) : (
						<BookInfoForm
							key={JSON.stringify(book)}
							bookId={book?.id ?? 0}
							defaultName={book?.name ?? ''}
							defaultSlug={book?.slug ?? ''}
							mutateBook={mutateBook}
						/>
					)}
				</SettingsTabsContent>
				<SettingsTabsContent value="doc">
					{isDocMetaLoading ? (
						<NotraSkeleton />
					) : (
						<DocSettingsForm
							key={JSON.stringify(docMeta)}
							bookId={docMeta?.bookId ?? 0}
							defaultSlug={docMeta?.slug ?? ''}
							docId={docMeta?.id ?? 0}
							mutateDocMeta={mutateDocMeta}
						/>
					)}
				</SettingsTabsContent>
			</SettingsTabs>
		</SettingsDialog>
	);
}
