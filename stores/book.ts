import { useParams } from 'next/navigation';

import { useGetBook } from '@/queries/book';
import { BookVo } from '@/types/book';

export const useCurrentBook = (fallbackData?: BookVo) => {
	const { book: bookSlug } = useParams<{ book: string }>();

	return useGetBook(bookSlug ?? '', fallbackData);
};
