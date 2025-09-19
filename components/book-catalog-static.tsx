import { BookEntity } from '@prisma/client';

import CatalogNodeService from '@/services/catalog-node';

import { BookCatalogStaticContent } from './book-catalog-static-client';

interface BookCatalogStaticProps {
	bookSlug: BookEntity['slug'];
}

export const BookCatalogStatic = async ({
	bookSlug
}: Readonly<BookCatalogStaticProps>) => {
	const { data } = await CatalogNodeService.getPublishedCatalogNodes(bookSlug);

	return (
		<nav className="mx-auto px-8 pt-4 md:px-0 md:pt-0">
			<BookCatalogStaticContent bookSlug={bookSlug} catalogNodes={data ?? []} />
		</nav>
	);
};
