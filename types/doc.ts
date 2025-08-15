import { DocEntity } from '@prisma/client';
import { InputJsonValue } from '@prisma/client/runtime/library';
import { z } from 'zod';

import { getTranslations } from '@/i18n';

export type DocMetaVo = Omit<DocEntity, 'content' | 'draftContent'>;

export type UpdateDocMetaDto = {
	id: DocEntity['id'];
} & {
	[key in keyof DocMetaVo]?: DocMetaVo[key];
};

export const DocSettingsFormSchema = z.object({
	slug: z
		.string()
		.min(1, { message: getTranslations('types_doc').slug_required })
});

export type DocSettingsFormValues = z.infer<typeof DocSettingsFormSchema>;

export type DocVo = DocEntity;

export type UpdateDocDraftContentDto = {
	id: DocEntity['id'];
	draftContent: InputJsonValue;
};
