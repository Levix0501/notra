'use client';

import { BookEntity, TreeNodeType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { useGetBook } from '@/queries/book';
import { useGetTreeNodes } from '@/queries/tree-node';

import { EmptyBook } from './empty-book';

export const DemoBookPage = ({ bookId }: { bookId: BookEntity['id'] }) => {
	const router = useRouter();
	const { isLoading: isLoadingBook } = useGetBook(bookId);
	const { data: treeNodes, isLoading: isLoadingTreeNodes } =
		useGetTreeNodes(bookId);

	const firstDocNode = useMemo(
		() => treeNodes?.find((node) => node.type === TreeNodeType.DOC),
		[treeNodes]
	);

	useEffect(() => {
		if (isLoadingBook || isLoadingTreeNodes) {
			return;
		}

		if (firstDocNode) {
			router.replace(`/demo/${bookId}/${firstDocNode.docId}`);
		}
	}, [bookId, firstDocNode, isLoadingBook, isLoadingTreeNodes, router]);

	if (isLoadingBook || isLoadingTreeNodes || firstDocNode) {
		return null;
	}

	return (
		<main className="container mx-auto p-4 md:p-8">
			<EmptyBook bookId={bookId} />
		</main>
	);
};
