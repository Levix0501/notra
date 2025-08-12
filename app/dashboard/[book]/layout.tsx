import { notFound } from 'next/navigation';

import BookCatalog from '@/components/book-catalog';
import BookSettingsButton from '@/components/book-settings-button';
import BookSidebarHeader from '@/components/book-sidebar-header';
import BookSidebarNav from '@/components/book-sidebar-nav';
import DashboardSidebarFooter from '@/components/dashboard-sidebar-footer';
import {
	NotraInset,
	NotraSidebar,
	NotraSidebarContent
} from '@/components/notra-sidebar';
import BookService from '@/services/book';

export default async function Layout({
	children,
	params
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ book: string }>;
}>) {
	const { book: slug } = await params;
	const { data: book } = await BookService.getBook(slug);

	if (!book) {
		notFound();
	}

	return (
		<>
			<NotraSidebar>
				<BookSidebarHeader />

				<NotraSidebarContent>
					<div className="mb-4 flex items-center justify-between gap-2 px-5 md:px-3.5">
						<span className="flex-1 truncate font-bold">{book.name}</span>
						<BookSettingsButton bookSlug={book.slug} />
					</div>

					<BookSidebarNav bookSlug={book.slug} />

					<div className="flex-1 overflow-hidden">
						<BookCatalog book={book} />
					</div>
				</NotraSidebarContent>

				<DashboardSidebarFooter />
			</NotraSidebar>

			<NotraInset>{children}</NotraInset>
		</>
	);
}
