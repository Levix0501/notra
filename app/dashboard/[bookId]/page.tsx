import { TreeNodeType } from '@prisma/client';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { EmptyBook } from '@/components/empty-book';
import { NotraInsetHeader } from '@/components/notra-sidebar';
import { BookService } from '@/services/book';
import { TreeNodeService } from '@/services/tree-node';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

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

	const { data: treeNodes } = await TreeNodeService.getTreeNodesByBookId(
		book.id
	);
	let docNode: TreeNodeVoWithLevel | undefined;

	if (
		treeNodes &&
		treeNodes.length > 0 &&
		(docNode = treeNodes.find((node) => node.type === TreeNodeType.DOC))
	) {
		redirect(`/dashboard/${bookId}/${docNode.docId}`);
	}

	return (
		<>
			<NotraInsetHeader>
				<div className="flex size-full items-center justify-between">
					<span></span>
				</div>
			</NotraInsetHeader>

			<main className="container mx-auto p-4 md:p-8">
				<EmptyBook bookId={book.id} />
			</main>
		</>
	);
}
