import { DocEntity } from '@prisma/client';

export type DocMetaVo = Omit<DocEntity, 'content' | 'draftContent'>;
