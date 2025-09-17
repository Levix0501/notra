import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BookIndexPageViewTabs from '@/components/book-index-page-view-tabs';
import { IndexPageCardView } from '@/components/index-page-card-view';
import { NotraInsetHeader } from '@/components/notra-sidebar';
import BookService from '@/services/book';

interface PageProps {
	params: Promise<{ book: string }>;
}

export const generateMetadata = async ({
	params
}: Readonly<PageProps>): Promise<Metadata> => {
	const { book: slug } = await params;
	const { data: book } = await BookService.getBook(slug);

	return {
		title: book?.name ?? ''
	};
};

export default async function Page({ params }: Readonly<PageProps>) {
	const { book: slug } = await params;
	const { data: book } = await BookService.getBook(slug);

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
					cardTabContent={<IndexPageCardView bookSlug={slug} />}
					defaultBook={book}
				/>
			</main>
		</>
	);
}
