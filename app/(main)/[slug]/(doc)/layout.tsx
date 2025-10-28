import { BookType } from '@prisma/client';
import { notFound } from 'next/navigation';

import { BookCatalogStatic } from '@/components/book-catalog-static';
import {
	BookCatalogStaticAside,
	BookCatalogStaticBackdrop,
	BookCatalogStaticTrigger
} from '@/components/book-catalog-static-client';
import { BookService } from '@/services/book';

export default async function Layout({
	children,
	params
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}>) {
	const { slug } = await params;
	const { data: book } = await BookService.getPublishedBookBySlug(slug);

	if (!book) {
		notFound();
	}

	return (
		<>
			<div className="px-4 md:flex md:justify-center">
				<div className="flex h-12 items-center md:hidden">
					{book.type === BookType.DOCS && <BookCatalogStaticTrigger />}
				</div>

				<BookCatalogStaticAside>
					{book.type === BookType.DOCS && (
						<BookCatalogStatic bookId={book.id} bookSlug={book.slug} />
					)}
				</BookCatalogStaticAside>
				{children}
				<div className="hidden w-64 shrink-0 lg:block"></div>
			</div>

			<BookCatalogStaticBackdrop />
		</>
	);
}
