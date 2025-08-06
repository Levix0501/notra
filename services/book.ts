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
}
