import { BookEntity, DocEntity } from '@prisma/client';
import { z } from 'zod';

import { getTranslations } from '@/i18n';

export type PublishedDocViewsVo = {
	id: DocEntity['id'];
	viewCount: DocEntity['viewCount'];
};

export type PublishedDocsMetaVo = Omit<
	DocEntity,
	| 'content'
	| 'draftContent'
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

export type DocMetaVo = Omit<DocEntity, 'content' | 'draftContent'> & {
	book: {
		slug: BookEntity['slug'];
	};
};

export type DocVo = DocEntity;

export type UpdateDocMetaDto = {
	id: DocEntity['id'];
} & {
	[key in keyof Omit<DocMetaVo, 'book'>]?: Omit<DocMetaVo, 'book'>[key];
};

export const DocSettingsFormSchema = z.object({
	cover: z.instanceof(File).nullable().optional(),
	summary: z.string(),
	slug: z
		.string()
		.min(1, { message: getTranslations('types_doc').slug_required })
});

export type DocSettingsFormValues = z.infer<typeof DocSettingsFormSchema>;

export type UpdateDocDraftContentDto = {
	id: DocEntity['id'];
	draftContent: string;
};
