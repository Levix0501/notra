import { useParams } from 'next/navigation';

import { useGetBook } from '@/queries/book';
import { BookVo } from '@/types/book';

export const useCurrentBook = (fallbackData?: BookVo) => {
	const { bookId } = useParams<{ bookId: string }>();

	return useGetBook(bookId, fallbackData);
};
