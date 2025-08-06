'use server';

import BookService from '@/services/book';
import { CreateBookFormValues } from '@/types/book';

export const createBook = async (values: CreateBookFormValues) => {
	const serviceResult = await BookService.createBook(values);

	return serviceResult.toPlainObject();
};
