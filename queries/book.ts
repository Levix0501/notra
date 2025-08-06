import { useFetcher } from '@/hooks/use-fetcher';
import { BookVo } from '@/types/book';

export const useGetBooks = () => useFetcher<BookVo[]>('/api/books');

export const useGetBook = (slug: string, fallbackData?: BookVo) =>
	useFetcher<BookVo>(slug ? `/api/books/${slug}` : void 0, { fallbackData });
