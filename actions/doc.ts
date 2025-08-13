'use server';

import DocService from '@/services/doc';
import { UpdateDocMetaDto } from '@/types/doc';

export const updateDocMeta = async (values: UpdateDocMetaDto) => {
	const serviceResult = await DocService.updateDocMeta(values);

	return serviceResult.toPlainObject();
};
