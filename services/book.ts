import { BookEntity } from '@prisma/client';
import { cache } from 'react';

import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { CreateBookFormValues } from '@/types/book';

export default class BookService {
	static async createBook(values: CreateBookFormValues) {
		try {
			const book = await prisma.$transaction(async (tx) => {
				const book = await tx.bookEntity.create({
					data: {
						name: values.name
					}
				});

				return await tx.bookEntity.update({
					where: { id: book.id },
					data: {
						slug: (book.id * 100000).toString(36)
					}
				});
			});

			return ServiceResult.success(book);
		} catch (error) {
			logger('BookService.createBook', error);
			const t = getTranslations('services_book');

			return ServiceResult.fail(t.create_book_error);
		}
	}

	static async deleteBook(id: BookEntity['id']) {
		try {
			await prisma.bookEntity.delete({
				where: { id }
			});

			return ServiceResult.success(true);
		} catch (error) {
			logger('BookService.deleteBook', error);
			const t = getTranslations('services_book');

			return ServiceResult.fail(t.delete_book_error);
		}
	}

	static readonly getBooks = cache(async () => {
		try {
			const books = await prisma.bookEntity.findMany({
				select: { id: true, slug: true, name: true },
				orderBy: {
					createdAt: 'desc'
				}
			});

			return ServiceResult.success(books);
		} catch (error) {
			logger('BookService.getBooks', error);
			const t = getTranslations('services_book');

			return ServiceResult.fail(t.get_books_error);
		}
	});
}
