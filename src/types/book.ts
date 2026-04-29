import { BookEntity } from '@prisma/client';
import { z } from 'zod';

import { INVALID_SLUG_LIST } from '@/constants/slug';
import { getTranslations } from '@/i18n';

export type BookVo = Omit<BookEntity, 'createdAt' | 'updatedAt'>;

export const CreateBookFormSchema = z.object({
	name: z.string()
});

export type CreateBookFormValues = z.infer<typeof CreateBookFormSchema>;

export type UpdateBookDto = { id: BookEntity['id'] } & {
	[key in keyof BookVo]?: BookVo[key];
};

export const UpdateBookInfoSchema = z.object({
	isPublished: z.boolean(),
	name: z
		.string()
		.min(1, { message: getTranslations('types_book').name_required }),
	slug: z
		.string()
		.min(2, { message: getTranslations('types_book').slug_min_length })
		.max(100, { message: getTranslations('types_book').slug_max_length })
		.regex(/^[a-z0-9._-]+$/, {
			message: getTranslations('types_book').slug_format_invalid
		})
		.refine(
			(slug) => {
				if (INVALID_SLUG_LIST.includes(slug)) {
					return false;
				}

				return true;
			},
			{ message: getTranslations('types_book').slug_invalid }
		),
	type: z.enum(['DOCS', 'BLOGS', 'PAGES', 'NAVBAR', 'CONTACT'])
});

export type UpdateBookInfoValues = z.infer<typeof UpdateBookInfoSchema>;
