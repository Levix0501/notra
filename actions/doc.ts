'use server';

import { BookEntity, DocEntity } from '@prisma/client';

import DocService from '@/services/doc';
import { UpdateDocMetaDto } from '@/types/doc';

export const updateDocMeta = async (values: UpdateDocMetaDto) => {
	const serviceResult = await DocService.updateDocMeta(values);

	return serviceResult.toPlainObject();
};

export const checkDocSlug = async (
	bookSlug: BookEntity['slug'],
	docSlug: DocEntity['slug']
) => {
	const serviceResult = await DocService.checkDocSlug(bookSlug, docSlug);

	return serviceResult.toPlainObject();
};
