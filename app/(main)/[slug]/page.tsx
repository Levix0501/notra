import { BookType, TreeNodeType } from '@prisma/client';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { BlogCards } from '@/components/blog-cards';
import { BookService } from '@/services/book';
import { DocService } from '@/services/doc';
import { TreeNodeService } from '@/services/tree-node';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

export const generateMetadata = async ({
	params
}: Readonly<{
	params: Promise<{ slug: string }>;
}>): Promise<Metadata> => {
	const { slug } = await params;
	const { data: book } = await BookService.getPublishedBookBySlug(slug);

	if (book) {
		return {
			title: book.name ?? ''
		};
	}

	const { data: page } = await DocService.getPublishedPageBySlug(slug);

	return {
		title: page?.title ?? ''
	};
};

export default async function Page({
	params
}: Readonly<{
	params: Promise<{ slug: string }>;
}>) {
	const { slug } = await params;
	const { data: book } = await BookService.getPublishedBookBySlug(slug);

	if (book) {
		if (book.type === BookType.PAGES || book.type === BookType.NAVBAR) {
			notFound();
		}

		if (book.type === BookType.DOCS) {
			const { data: treeNodes } =
				await TreeNodeService.getPublishedTreeNodesByBookId(book.id);
			let docNode: TreeNodeVoWithLevel | undefined;

			if (
				treeNodes &&
				treeNodes.length > 0 &&
				(docNode = treeNodes.find((node) => node.type === TreeNodeType.DOC))
			) {
				redirect(`/${slug}/${docNode.url}`);
			}

			notFound();
		}

		return <BlogCards bookId={book.id} />;
	}

	const { data: page } = await DocService.getPublishedPageBySlug(slug);

	if (!page) {
		notFound();
	}

	return <div>DocPage</div>;
}
