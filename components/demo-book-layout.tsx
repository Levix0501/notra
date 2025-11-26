'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useGetBook } from '@/queries/book';

export const DemoBookLayout = ({
	bookId,
	children
}: {
	bookId: number;
	children: React.ReactNode;
}) => {
	const router = useRouter();
	const { data: book, isLoading: isLoadingBook } = useGetBook(bookId);

	useEffect(() => {
		if (isLoadingBook) {
			return;
		}

		if (!book) {
			router.push('/demo');

			return;
		}
	}, [book, router, isLoadingBook]);

	return children;
};
