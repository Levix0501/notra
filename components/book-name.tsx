'use client';

import { BookEntity } from '@prisma/client';

import { useGetBook } from '@/queries/book';

interface BookNameProps {
	bookId: BookEntity['id'];
}

export function BookName({ bookId }: Readonly<BookNameProps>) {
	const { data: book } = useGetBook(bookId);

	return <span className="truncate font-bold">{book?.name}</span>;
}
