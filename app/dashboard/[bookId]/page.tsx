import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BookIndexPageViewTabs from '@/components/book-index-page-view-tabs';
import { IndexPageCardView } from '@/components/index-page-card-view';
import { NotraInsetHeader } from '@/components/notra-sidebar';
import BookService from '@/services/book';

interface PageProps {
	params: Promise<{ bookId: string }>;
}

export const generateMetadata = async ({
	params
}: Readonly<PageProps>): Promise<Metadata> => {
	const { bookId } = await params;
	const { data: book } = await BookService.getBook(Number(bookId));

	return {
		title: book?.name ?? ''
	};
};

export default async function Page({ params }: Readonly<PageProps>) {
	const { bookId } = await params;
	const { data: book } = await BookService.getBook(Number(bookId));

	if (!book) {
		notFound();
	}

	return (
		<>
			<NotraInsetHeader>
				<div className="flex size-full items-center justify-between">
					<span></span>
				</div>
			</NotraInsetHeader>

			<main className="container mx-auto p-4 md:p-8">
				<BookIndexPageViewTabs
					cardTabContent={<IndexPageCardView bookId={book.id} />}
					defaultBook={book}
				/>
			</main>
		</>
	);
}
