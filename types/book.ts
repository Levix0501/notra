import { BookEntity } from '@prisma/client';
import { z } from 'zod';

import { INVALID_BOOK_SLUG_LIST } from '@/constants/slug';
import { getTranslations } from '@/i18n';

export const CreateBookFormSchema = z.object({
	name: z.string()
});

export type CreateBookFormValues = z.infer<typeof CreateBookFormSchema>;

export type BookVo = Omit<BookEntity, 'createdAt' | 'updatedAt'>;

export type UpdateBookDto = { id: BookEntity['id'] } & {
	[key in keyof BookVo]?: BookVo[key];
};

export const UpdateBookInfoSchema = z.object({
	name: z
		.string()
		.min(1, { message: getTranslations('types_book').name_required }),
	slug: z
		.string()
		.min(1, { message: getTranslations('types_book').slug_required })
		.refine(
			(slug) => {
				if (INVALID_BOOK_SLUG_LIST.includes(slug)) {
					return false;
				}

				return true;
			},
			{ message: getTranslations('types_book').slug_invalid }
		)
});

export type UpdateBookInfoValues = z.infer<typeof UpdateBookInfoSchema>;
