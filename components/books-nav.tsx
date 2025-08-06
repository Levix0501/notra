'use client';

import { MoreHorizontal, Plus, SlidersHorizontal, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { getTranslations } from '@/i18n';
import { useGetBooks } from '@/queries/book';

import { useCreateBookDialog } from './create-book-dialog';
import NotraSidebarButton, {
	NotraSidebarMenu,
	NotraSidebarMenuItem
} from './notra-sidebar';
import { ScrollArea } from './ui/scroll-area';

const t = getTranslations('components_books_nav');

export default function BooksNav() {
	const { data: books, isLoading, mutate } = useGetBooks();

	const setOpenCreateBookDialog = useCreateBookDialog((state) => state.setOpen);

	const handleCreateBook = () => {
		setOpenCreateBookDialog(true);
	};

	return (
		<div className="flex-1 overflow-hidden">
			<ScrollArea className="h-full">
				<p className="mt-5 px-4 py-2 text-sm text-muted-foreground">
					{t.books}
				</p>
				<NotraSidebarMenu>
					{isLoading && (
						<div className="px-2">
							<div className="py-2">
								<Skeleton className="h-4" />
							</div>
							<div className="py-2">
								<Skeleton className="h-4" />
							</div>
							<div className="py-2">
								<Skeleton className="h-4" />
							</div>
						</div>
					)}

					{!isLoading && (
						<NotraSidebarMenuItem>
							<NotraSidebarButton
								className="text-secondary-foreground"
								onClick={handleCreateBook}
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
											<DropdownMenuItem asChild>
												<div className="flex items-center gap-2">
													<SlidersHorizontal className="text-muted-foreground" />
													<span>{t.settings}</span>
												</div>
											</DropdownMenuItem>

											<DropdownMenuSeparator />

											<DropdownMenuItem
												asChild
												variant="destructive"
												onClick={() => {}}
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
		</div>
	);
}
