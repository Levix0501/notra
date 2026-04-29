import { notFound } from 'next/navigation';

import { BookService } from '@/services/book';

export const generateStaticParams = async () => {
	return [];
};

export default async function Layout({
	children,
	params
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ bookId: string }>;
}>) {
	const { bookId } = await params;
	const { data: book } = await BookService.getBook(Number(bookId));

	if (!book) {
		notFound();
	}

	return children;
}
