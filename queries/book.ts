import { BookEntity } from '@prisma/client';

import { useFetcher } from '@/hooks/use-fetcher';
import { BookVo } from '@/types/book';
import { Nullable } from '@/types/common';

export const useGetBooks = () => useFetcher<BookVo[]>('/api/books');

export const useGetBook = (
	bookId: Nullable<BookEntity['id'] | string>,
	fallbackData?: BookVo
) =>
	useFetcher<BookVo>(bookId ? `/api/books?book_id=${bookId}` : void 0, {
		fallbackData
	});
