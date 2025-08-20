import { IndexPageType } from '@prisma/client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import IndexPageDocView from '@/components/index-page-doc-view';
import BookService from '@/services/book';

export const generateMetadata = async ({
	params
}: Readonly<{
	params: Promise<{ book: string }>;
}>): Promise<Metadata> => {
	const { book: slug } = await params;
	const { data: book } = await BookService.getBook(slug);

	return {
		title: book?.name ?? ''
	};
};

export default async function Page({
	params
}: Readonly<{
	params: Promise<{ book: string }>;
}>) {
	const { book: slug } = await params;
	const { data: book } = await BookService.getBook(slug);

	if (!book) {
		notFound();
	}

	if (book?.indexPageType === IndexPageType.DOC) {
		return (
			<IndexPageDocView
				indexDescription={book?.indexDescription ?? ''}
				indexTitle={book?.indexTitle ?? ''}
				isMainNewTab={book?.isMainNewTab ?? false}
				isSubNewTab={book?.isSubNewTab ?? false}
				mainActionText={book?.mainActionText ?? ''}
				mainActionUrl={book?.mainActionUrl ?? '#'}
				subActionText={book?.subActionText ?? ''}
				subActionUrl={book?.subActionUrl ?? '#'}
			/>
		);
	}

	return null;
}
