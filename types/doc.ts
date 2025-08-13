import { DocEntity } from '@prisma/client';

export type DocMetaVo = Omit<DocEntity, 'content' | 'draftContent'>;

export type UpdateDocMetaDto = {
	id: DocEntity['id'];
} & {
	[key in keyof DocMetaVo]?: DocMetaVo[key];
};
