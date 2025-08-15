'use client';

import { useCurrentBook } from '@/stores/book';
import { BookVo } from '@/types/book';

interface BookNameProps {
	defaultBook: BookVo;
}

export default function BookName({ defaultBook }: Readonly<BookNameProps>) {
	const { data: book } = useCurrentBook(defaultBook);

	return <span className="flex-1 truncate font-bold">{book?.name}</span>;
}
