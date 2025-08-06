import { useFetcher } from '@/hooks/use-fetcher';
import { BookVo } from '@/types/book';

export const useGetBooks = () => useFetcher<BookVo[]>('/api/books');
