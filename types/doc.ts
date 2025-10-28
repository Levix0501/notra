import { BookEntity, DocEntity } from '@prisma/client';
import { z } from 'zod';

import { getTranslations } from '@/i18n';

export type PublishedBlogVo = Omit<
	DocEntity,
	| 'content'
	| 'isUpdated'
	| 'isPublished'
	| 'isDeleted'
	| 'createdAt'
	| 'updatedAt'
> & {
	book: {
		slug: BookEntity['slug'];
	};
};

export type DocMetaVo = Omit<DocEntity, 'content'> & {
	book: {
		slug: BookEntity['slug'];
		type: BookEntity['type'];
	};
};

export type UpdateDocMetaDto = {
	id: DocEntity['id'];
} & {
	[key in keyof Omit<DocMetaVo, 'book'>]?: Omit<DocMetaVo, 'book'>[key];
};

export type DocVo = DocEntity;

export type UpdateDocContentDto = {
	id: DocEntity['id'];
	content: string;
};

export const DocSettingsFormSchema = z.object({
	cover: z.instanceof(File).nullable().optional(),
	summary: z.string(),
	slug: z
		.string()
		.min(2, { message: getTranslations('types_book').slug_min_length })
		.max(100, { message: getTranslations('types_book').slug_max_length })
		.regex(/^[a-z0-9._-]+$/, {
			message: getTranslations('types_book').slug_format_invalid
		})
});

export type DocSettingsFormValues = z.infer<typeof DocSettingsFormSchema>;
