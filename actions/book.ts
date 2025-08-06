'use server';

import BookService from '@/services/book';
import { CreateBookFormValues } from '@/types/book';

export const createBook = async (values: CreateBookFormValues) => {
	const serviceResult = await BookService.createBook(values);

	return serviceResult.toPlainObject();
};

export const deleteBook = async (id: number) => {
	const serviceResult = await BookService.deleteBook(id);

	return serviceResult.toPlainObject();
};
