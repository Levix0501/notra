'use server';

import { revalidatePath } from 'next/cache';

import BookService from '@/services/book';
import { CreateBookFormValues, UpdateBookDto } from '@/types/book';

export const createBook = async (values: CreateBookFormValues) => {
	const serviceResult = await BookService.createBook(values);

	return serviceResult.toPlainObject();
};

export const deleteBook = async (id: number) => {
	const serviceResult = await BookService.deleteBook(id);

	return serviceResult.toPlainObject();
};

export const checkBookSlug = async (slug: string) => {
	const serviceResult = await BookService.checkBookSlug(slug);

	return serviceResult.toPlainObject();
};

export const updateBook = async (values: UpdateBookDto) => {
	const serviceResult = await BookService.updateBook(values);

	revalidatePath('/', 'layout');

	return serviceResult.toPlainObject();
};
