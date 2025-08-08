import { useEffect } from 'react';
import { create } from 'zustand';

import { BookVo } from '@/types/book';
import { Nullable } from '@/types/common';

type BookStore = {
	book: Nullable<BookVo>;
	setBook: (book: Nullable<BookVo>) => void;
};

const useBookStore = create<BookStore>((set) => ({
	book: null,
	setBook: (book) => set({ book })
}));

export const useBook = () => useBookStore((state) => state.book);

export const useSetBook = (book: BookVo) => {
	const setBook = useBookStore((state) => state.setBook);

	useEffect(() => {
		setBook(book);

		return () => {
			setBook(null);
		};
	}, [book, setBook]);
};
