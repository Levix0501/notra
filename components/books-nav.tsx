'use client';

import { MoreHorizontal, Plus, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { deleteBook } from '@/actions/book';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';
import { useGetBooks } from '@/queries/book';
import { BookVo } from '@/types/book';

import { useBookSettingsDialog } from './book-settings-dialog';
import { useCreateBookDialog } from './create-book-dialog';
import { NotraAlertDialog } from './notra-alert-dialog';
import {
	NotraSidebarButton,
	NotraSidebarMenu,
	NotraSidebarMenuItem
} from './notra-sidebar';
import NotraSkeleton from './notra-skeleton';
import { ScrollArea } from './ui/scroll-area';

const t = getTranslations('components_books_nav');

export default function BooksNav() {
	const [bookToDelete, setBookToDelete] = useState<BookVo | null>(null);
	const [openDeleteBookDialog, setOpenDeleteBookDialog] = useState(false);

	const { data: books, isLoading, mutate } = useGetBooks();
	const setOpenCreateBookDialog = useCreateBookDialog((state) => state.setOpen);
	const setSlug = useBookSettingsDialog((state) => state.setSlug);
	const setOpenBookSettingsDialog = useBookSettingsDialog(
		(state) => state.setOpen
	);

	const handleOpenCreateBookDialog = () => {
		setOpenCreateBookDialog(true);
	};

	const handleDeleteBook = async () => {
		if (!bookToDelete) {
			return;
		}

		const promise = deleteBook(bookToDelete.id);

		toast
			.promise(promise, {
				loading: t.delete_loading,
				success: t.delete_success,
				error: t.delete_error
			})
			.unwrap()
			.then(() => {
				mutate();
			});
	};

	return (
		<>
			<p className="mt-3 px-4 py-2 text-sm text-muted-foreground">{t.books}</p>
			<div className="flex-1 overflow-hidden">
				<ScrollArea className="h-full">
					<NotraSidebarMenu>
						{isLoading && <NotraSkeleton />}

						{!isLoading && (
							<NotraSidebarMenuItem>
								<NotraSidebarButton
									className="text-secondary-foreground"
									onClick={handleOpenCreateBookDialog}
								>
									<Plus size={16} /> <span>{t.new_book}</span>
								</NotraSidebarButton>
							</NotraSidebarMenuItem>
						)}

						{books?.map((item) => (
							<NotraSidebarMenuItem key={item.id}>
								<NotraSidebarButton href={`/dashboard/${item.slug}`}>
									<div className="flex w-full items-center justify-between">
										<span>{item.name}</span>

										<DropdownMenu modal={false}>
											<DropdownMenuTrigger asChild>
												<Button
													className="size-5 rounded-sm hover:bg-transparent data-[state=open]:opacity-100 md:opacity-0 md:group-hover/menu-item:opacity-100"
													data-prevent-progress={true}
													size="icon"
													variant="ghost"
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
													}}
												>
													<MoreHorizontal />
													<span className="sr-only">More</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												onClick={(e) => {
													e.stopPropagation();
												}}
											>
												<DropdownMenuItem
													asChild
													onClick={() => {
														setSlug(item.slug);
														setOpenBookSettingsDialog(true);
													}}
												>
													<div className="flex items-center gap-2">
														<SlidersHorizontal className="text-muted-foreground" />
														<span>{t.settings}</span>
													</div>
												</DropdownMenuItem>

												<DropdownMenuSeparator />

												<DropdownMenuItem
													asChild
													variant="destructive"
													onClick={() => {
														setBookToDelete(item);
														setOpenDeleteBookDialog(true);
													}}
												>
													<div className="flex items-center gap-2">
														<Trash2 />
														<span>{t.delete}</span>
													</div>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</NotraSidebarButton>
							</NotraSidebarMenuItem>
						))}
					</NotraSidebarMenu>
				</ScrollArea>

				<NotraAlertDialog
					cancelText={t.cancel}
					confirmText={t.confirm}
					description={t.delete_book_description.replace(
						'{name}',
						bookToDelete?.name ?? ''
					)}
					open={openDeleteBookDialog}
					title={t.delete_book}
					onConfirm={handleDeleteBook}
					onOpenChange={setOpenDeleteBookDialog}
				/>
			</div>
		</>
	);
}
