import { BookEntity, DocEntity } from '@prisma/client';
import { cache } from 'react';

import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { UpdateDocMetaDto } from '@/types/doc';

export default class DocService {
	static readonly getDocMeta = cache(
		async (bookSlug: BookEntity['slug'], docSlug: DocEntity['slug']) => {
			try {
				const doc = await prisma.docEntity.findFirst({
					where: {
						slug: docSlug,
						book: {
							slug: bookSlug
						}
					},
					omit: {}
				});

				return ServiceResult.success(doc);
			} catch (error) {
				logger('DocService.getDocMeta', error);
				const t = getTranslations('services_doc');

				return ServiceResult.fail(t.get_doc_meta_error);
			}
		}
	);

	static readonly getDoc = cache(
		async (bookSlug: BookEntity['slug'], docSlug: DocEntity['slug']) => {
			try {
				const doc = await prisma.docEntity.findFirst({
					where: {
						slug: docSlug,
						book: {
							slug: bookSlug
						}
					}
				});

				return ServiceResult.success(doc);
			} catch (error) {
				logger('DocService.getDoc', error);
				const t = getTranslations('services_doc');

				return ServiceResult.fail(t.get_doc_error);
			}
		}
	);

	static readonly getDocsByBookSlug = cache(
		async (bookSlug: BookEntity['slug']) => {
			try {
				const docs = await prisma.docEntity.findMany({
					where: { book: { slug: bookSlug } }
				});

				return ServiceResult.success(docs);
			} catch (error) {
				logger('DocService.getDocsByBookSlug', error);
				const t = getTranslations('services_doc');

				return ServiceResult.fail(t.get_docs_by_book_slug_error);
			}
		}
	);

	static async updateDocMeta({ id, ...values }: UpdateDocMetaDto) {
		try {
			const doc = await prisma.$transaction(async (tx) => {
				const doc = await tx.docEntity.update({
					where: { id },
					data: values,
					include: {
						book: true
					}
				});

				if (values.title !== void 0 || values.slug !== void 0) {
					await tx.catalogNodeEntity.update({
						where: { docId: id },
						data: {
							title: values.title,
							url: values.slug
						}
					});
				}

				return doc;
			});

			return DocService.getDocMeta(doc.book.slug, doc.slug);
		} catch (error) {
			logger('DocService.updateDocMeta', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.update_doc_meta_error);
		}
	}

	static readonly checkDocSlug = async (
		bookSlug: BookEntity['slug'],
		docSlug: DocEntity['slug']
	) => {
		try {
			const doc = await prisma.docEntity.findFirst({
				where: { slug: docSlug, book: { slug: bookSlug } }
			});

			return ServiceResult.success(!doc);
		} catch (error) {
			logger('DocService.checkDocSlug', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.check_doc_slug_error);
		}
	};
}
