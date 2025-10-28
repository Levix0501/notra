import { useFetcher } from '@/hooks/use-fetcher';
import { BookVo } from '@/types/book';
import { Nullable } from '@/types/common';

export const useGetBooks = () => useFetcher<BookVo[]>('/api/books');

export const useGetBook = (bookId: Nullable<BookVo['id'] | string>) =>
	useFetcher<BookVo>(bookId ? `/api/books/${bookId}` : void 0);
