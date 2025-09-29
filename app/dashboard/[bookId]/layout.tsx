import { notFound } from 'next/navigation';

import BookCatalog from '@/components/book-catalog';
import BookName from '@/components/book-name';
import BookSettingsButton from '@/components/book-settings-button';
import BookSidebarHeader from '@/components/book-sidebar-header';
import BookSidebarNav from '@/components/book-sidebar-nav';
import { BooksDropdown } from '@/components/books-dropdown';
import DashboardSidebarFooter from '@/components/dashboard-sidebar-footer';
import {
	NotraInset,
	NotraSidebar,
	NotraSidebarContent
} from '@/components/notra-sidebar';
import BookService from '@/services/book';

export const generateStaticParams = async () => {
	return [];
};

export default async function Layout({
	children,
	params
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ bookId: string }>;
}>) {
	const { bookId } = await params;
	const { data: book } = await BookService.getBook(Number(bookId));

	if (!book) {
		notFound();
	}

	return (
		<>
			<NotraSidebar>
				<BookSidebarHeader />

				<NotraSidebarContent>
					<div className="mb-4 flex items-center justify-between px-5 md:px-3.5">
						<div className="flex items-center gap-1">
							<BookName defaultBook={book} />
							<BooksDropdown />
						</div>
						<BookSettingsButton bookId={book.id} />
					</div>

					<BookSidebarNav bookId={book.id} />

					<div className="flex-1 overflow-hidden">
						<BookCatalog bookId={book.id} />
					</div>
				</NotraSidebarContent>

				<DashboardSidebarFooter />
			</NotraSidebar>

			<NotraInset>{children}</NotraInset>
		</>
	);
}
