'use client';

import {
	BookText,
	Ellipsis,
	Plus,
	SlidersHorizontal,
	Trash2
} from 'lucide-react';
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

import { useBookSettingsSheet } from './book-settings-sheet';
import { useCreateBookDialog } from './create-book-dialog';
import { NotraAlertDialog } from './notra-alert-dialog';
import {
	NotraSidebarButton,
	NotraSidebarMenu,
	NotraSidebarMenuItem
} from './notra-sidebar';
import { NotraSkeleton } from './notra-skeleton';
import { ScrollArea } from './ui/scroll-area';

const t = getTranslations('components_books_nav');

export function BooksNav() {
	const [bookToDelete, setBookToDelete] = useState<BookVo | null>(null);
	const [openDeleteBookDialog, setOpenDeleteBookDialog] = useState(false);

	const { data: books, isLoading, mutate } = useGetBooks();
	const setOpenCreateBookDialog = useCreateBookDialog((state) => state.setOpen);

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
									className="px-1 text-secondary-foreground"
									onClick={handleOpenCreateBookDialog}
								>
									<Plus size={16} /> <span>{t.new_book}</span>
								</NotraSidebarButton>
							</NotraSidebarMenuItem>
						)}

						{books?.map((item) => (
							<NotraSidebarMenuItem key={item.id}>
								<NotraSidebarButton href={`/dashboard/${item.id}`}>
									<div className="flex w-full items-center">
										<BookText className="mr-2" size={16} />

										<div className="flex-1 truncate select-none">
											{item.name}
										</div>

										<div className="opacity-100 md:opacity-0 md:group-hover/menu-item:opacity-100">
											<DropdownMenu modal={false}>
												<DropdownMenuTrigger
													asChild
													onClick={(e) => {
														e.stopPropagation();
														e.preventDefault();
													}}
												>
													<Button
														className="size-6 hover:bg-border"
														size="icon"
														variant="ghost"
													>
														<Ellipsis />
														<span className="sr-only">More</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="start"
													onClick={(e) => e.stopPropagation()}
												>
													<DropdownMenuItem
														onClick={() => {
															useBookSettingsSheet.setState({
																open: true,
																bookId: item.id
															});
														}}
													>
														<SlidersHorizontal className="text-popover-foreground" />
														{t.settings}
													</DropdownMenuItem>

													<DropdownMenuSeparator />

													<DropdownMenuItem
														variant="destructive"
														onClick={() => {
															setBookToDelete(item);
															setOpenDeleteBookDialog(true);
														}}
													>
														<Trash2 />
														{t.delete}
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
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
