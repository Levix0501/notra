'use server';

import { DocEntity } from '@prisma/client';

import { DocService } from '@/services/doc';
import {
	CheckDocSlugDto,
	UpdateDocContentDto,
	UpdateDocMetaDto
} from '@/types/doc';

export const updateDocMeta = async (values: UpdateDocMetaDto) => {
	const serviceResult = await DocService.updateDocMeta(values);

	return serviceResult.toPlainObject();
};

export const updateDocContent = async (values: UpdateDocContentDto) => {
	const serviceResult = await DocService.updateDocContent(values);

	return serviceResult.toPlainObject();
};

export const checkDocSlug = async (dto: CheckDocSlugDto) => {
	const serviceResult = await DocService.checkDocSlug(dto);

	return serviceResult.toPlainObject();
};

export const incrementViewCount = async (docId: DocEntity['id']) => {
	const serviceResult = await DocService.incrementViewCount(docId);

	return serviceResult.toPlainObject();
};
