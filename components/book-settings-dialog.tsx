'use client';

import { Settings } from 'lucide-react';
import { create } from 'zustand';

import { getTranslations } from '@/i18n';
import { useGetBook } from '@/queries/book';

import BookInfoForm from './book-info-form';
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
	slug: string;
	setSlug: (slug: string) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
};

export const useBookSettingsDialog = create<BookSettingsDialogStore>((set) => ({
	slug: '',
	setSlug: (slug) => set({ slug }),
	open: false,
	setOpen: (open) => set({ open })
}));

const t = getTranslations('components_book_settings_dialog');

export default function BookSettingsDialog() {
	const slug = useBookSettingsDialog((state) => state.slug);
	const open = useBookSettingsDialog((state) => state.open);
	const setOpen = useBookSettingsDialog((state) => state.setOpen);
	const { data: book, mutate, isLoading } = useGetBook(slug);

	return (
		<SettingsDialog open={open} onOpenChange={setOpen}>
			<SettingsTabs defaultValue="book-info">
				<SettingsTabsList>
					<CloseButton onClick={() => setOpen(false)} />
					<SettingsTabsTrigger value="book-info">
						<Settings />
						<div className="flex-1">
							<span className="truncate">{t.book_info}</span>
						</div>
					</SettingsTabsTrigger>
				</SettingsTabsList>

				<SettingsTabsContent value="book-info">
					{isLoading ? (
						<NotraSkeleton />
					) : (
						<BookInfoForm
							key={JSON.stringify(book)}
							bookId={book?.id ?? 0}
							defaultName={book?.name ?? ''}
							defaultSlug={book?.slug ?? ''}
							mutateBook={mutate}
						/>
					)}
				</SettingsTabsContent>
			</SettingsTabs>
		</SettingsDialog>
	);
}
