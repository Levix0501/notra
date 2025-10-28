import { BookEntity } from '@prisma/client';

import { TreeNodeService } from '@/services/tree-node';

import { BookCatalogStaticContent } from './book-catalog-static-client';

interface BookCatalogStaticProps {
	bookId: BookEntity['id'];
	bookSlug: BookEntity['slug'];
}

export const BookCatalogStatic = async ({
	bookId,
	bookSlug
}: Readonly<BookCatalogStaticProps>) => {
	const { data } = await TreeNodeService.getPublishedTreeNodesByBookId(bookId);

	return (
		<nav className="mx-auto px-8 pt-4 md:px-0 md:pt-0">
			<BookCatalogStaticContent bookSlug={bookSlug} treeNodes={data ?? []} />
		</nav>
	);
};
