'use server';

import { BookEntity, DocEntity } from '@prisma/client';

import DocService from '@/services/doc';
import { UpdateDocContentDto, UpdateDocMetaDto } from '@/types/doc';

export const updateDocMeta = async (values: UpdateDocMetaDto) => {
	const serviceResult = await DocService.updateDocMeta(values);

	return serviceResult.toPlainObject();
};

export const checkDocSlug = async (
	bookId: BookEntity['id'],
	docSlug: DocEntity['slug']
) => {
	const serviceResult = await DocService.checkDocSlug(bookId, docSlug);

	return serviceResult.toPlainObject();
};

export const updateDocContent = async (values: UpdateDocContentDto) => {
	const serviceResult = await DocService.updateDocContent(values);

	return serviceResult.toPlainObject();
};

export const incrementViewCount = async (docId: DocEntity['id']) => {
	const serviceResult = await DocService.incrementViewCount(docId);

	return serviceResult.toPlainObject();
};
