import { notFound } from 'next/navigation';

import BookNavHome from '@/components/book-nav-home';
import BookSettingsButton from '@/components/book-settings-button';
import DashboardSidebarHeader from '@/components/dashboard-sidebar-header';
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
				<DashboardSidebarHeader />

				<NotraSidebarContent>
					<div className="flex flex-col gap-4 px-4 md:px-2.5">
						<div className="flex items-center justify-between gap-2 px-1">
							<span className="flex-1 truncate font-bold">{book.name}</span>

							<BookSettingsButton bookSlug={book.slug} />
						</div>
						<BookNavHome bookSlug={book.slug} />
					</div>
				</NotraSidebarContent>
			</NotraSidebar>

			<NotraInset>{children}</NotraInset>
		</>
	);
}
