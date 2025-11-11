import { BookType } from '@prisma/client';
import { notFound } from 'next/navigation';

import { BookCatalogStatic } from '@/components/book-catalog-static';
import {
	BookCatalogStaticAside,
	BookCatalogStaticBackdrop
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
			<div className="md:flex md:justify-center md:px-4">
				<BookCatalogStaticAside>
					{book.type === BookType.DOCS && (
						<BookCatalogStatic bookId={book.id} bookSlug={book.slug} />
					)}
				</BookCatalogStaticAside>
				{children}
			</div>

			<BookCatalogStaticBackdrop />
		</>
	);
}
