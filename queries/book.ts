import useSWR from 'swr';

import { useApp } from '@/contexts/app-context';
import { useFetcher } from '@/hooks/use-fetcher';
import { DemoService } from '@/services/demo';
import { BookVo } from '@/types/book';
import { Nullable } from '@/types/common';

export const useGetBooks = () => {
	const { isDemo } = useApp();
	const demo = useSWR(isDemo ? '/demo/books' : void 0, DemoService.getBooks);
	const api = useFetcher<BookVo[]>(isDemo ? void 0 : '/api/books');

	return isDemo ? demo : api;
};

export const useGetBook = (bookId: Nullable<BookVo['id']>) => {
	const { isDemo } = useApp();
	const demo = useSWR(isDemo && bookId ? `/demo/books/${bookId}` : void 0, () =>
		DemoService.getBook(bookId!)
	);
	const api = useFetcher<BookVo>(isDemo ? void 0 : `/api/books/${bookId}`);

	return isDemo ? demo : api;
};
