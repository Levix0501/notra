import { BookEntity } from '@prisma/client';
import { cache } from 'react';

import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { CreateBookFormValues, UpdateBookDto } from '@/types/book';

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
			await prisma.$transaction(async (tx) => {
				await tx.catalogNodeEntity.deleteMany({
					where: { bookId: id }
				});
				await tx.docEntity.deleteMany({
					where: { bookId: id }
				});
				await tx.bookEntity.delete({
					where: { id }
				});
			});

			return ServiceResult.success(true);
		} catch (error) {
			logger('BookService.deleteBook', error);
			const t = getTranslations('services_book');

			return ServiceResult.fail(t.delete_book_error);
		}
	}

	static async updateBook({ id, ...values }: UpdateBookDto) {
		try {
			const book = await prisma.bookEntity.update({
				where: { id },
				data: values
			});

			return ServiceResult.success(book);
		} catch (error) {
			logger('BookService.updateBook', error);
			const t = getTranslations('services_book');

			return ServiceResult.fail(t.update_book_error);
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

	static readonly getBook = cache(async (id: BookEntity['id']) => {
		try {
			const book = await prisma.bookEntity.findUnique({
				where: { id },
				omit: {
					createdAt: true,
					updatedAt: true
				}
			});

			return ServiceResult.success(book);
		} catch (error) {
			logger('BookService.getBook', error);
			const t = getTranslations('services_book');

			return ServiceResult.fail(t.get_book_error);
		}
	});

	static readonly getBookBySlug = cache(async (slug: BookEntity['slug']) => {
		try {
			const book = await prisma.bookEntity.findUnique({
				where: { slug },
				omit: {
					createdAt: true,
					updatedAt: true
				}
			});

			return ServiceResult.success(book);
		} catch (error) {
			logger('BookService.getBookBySlug', error);
			const t = getTranslations('services_book');

			return ServiceResult.fail(t.get_book_by_slug_error);
		}
	});

	static readonly checkBookSlug = async (slug: BookEntity['slug']) => {
		try {
			const book = await prisma.bookEntity.findUnique({
				where: { slug }
			});

			return ServiceResult.success(!book);
		} catch (error) {
			logger('BookService.checkBookSlug', error);
			const t = getTranslations('services_book');

			return ServiceResult.fail(t.check_book_slug_error);
		}
	};
}
