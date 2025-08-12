import { cache } from 'react';

import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';

export default class DocService {
	static readonly getDocMeta = cache(async (slug: string) => {
		try {
			const doc = await prisma.docEntity.findUnique({
				where: { slug },
				omit: {}
			});

			return ServiceResult.success(doc);
		} catch (error) {
			logger('DocService.getDocMeta', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.get_doc_meta_error);
		}
	});
}
