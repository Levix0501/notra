import { IndexPageType } from '@prisma/client';
import { notFound } from 'next/navigation';

import { BookCatalogStatic } from '@/components/book-catalog-static';
import {
	BookCatalogStaticAside,
	BookCatalogStaticBackdrop,
	BookCatalogStaticTrigger
} from '@/components/book-catalog-static-client';
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
			<div className="px-4 md:flex md:justify-center">
				<div className="flex h-12 items-center md:hidden">
					{book.indexPageType === IndexPageType.DOC && (
						<BookCatalogStaticTrigger />
					)}
				</div>

				<BookCatalogStaticAside>
					{book.indexPageType === IndexPageType.DOC && (
						<BookCatalogStatic bookSlug={book.slug} />
					)}
				</BookCatalogStaticAside>
				{children}
				<div className="hidden w-64 shrink-0 lg:block"></div>
			</div>

			<BookCatalogStaticBackdrop />
		</>
	);
}
