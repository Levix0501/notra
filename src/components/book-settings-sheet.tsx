'use client';

import { BookEntity } from '@prisma/client';
import { create } from 'zustand';

import { getTranslations } from '@/i18n';
import { useGetBook } from '@/queries/book';
import { Nullable } from '@/types/common';

import { BookSettingsForm } from './book-settings-form';
import { NotraSkeleton } from './notra-skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

type BookSettingsSheetStore = {
	open: boolean;
	setOpen: (open: boolean) => void;
	bookId: Nullable<BookEntity['id']>;
	setBookId: (bookId: BookEntity['id']) => void;
};

export const useBookSettingsSheet = create<BookSettingsSheetStore>((set) => ({
	open: false,
	setOpen: (open) => set({ open }),
	bookId: null,
	setBookId: (bookId) => set({ bookId })
}));

const t = getTranslations('components_book_settings_sheet');

export const BookSettingsSheet = () => {
	const { open, setOpen, bookId } = useBookSettingsSheet();
	const { data: book, isLoading, mutate } = useGetBook(bookId);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent
				onCloseAutoFocus={(e) => e.preventDefault()}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<SheetHeader>
					<SheetTitle>{t.book_settings}</SheetTitle>
				</SheetHeader>

				<div className="px-4">
					{isLoading || !bookId ? (
						<NotraSkeleton />
					) : (
						<BookSettingsForm
							bookId={bookId}
							defaultIsPublished={book?.isPublished ?? false}
							defaultName={book?.name ?? ''}
							defaultSlug={book?.slug ?? ''}
							defaultType={book?.type ?? 'BLOGS'}
							mutateBook={mutate}
						/>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
};
