import { notFound } from 'next/navigation';

import BookNavHome from '@/components/book-nav-home';
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
}: {
	children: React.ReactNode;
	params: Promise<{ book: string }>;
}) {
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
						<span className="font-bold">{book.name}</span>
						<BookNavHome bookSlug={book.slug} />
					</div>
				</NotraSidebarContent>
			</NotraSidebar>

			<NotraInset>{children}</NotraInset>
		</>
	);
}
