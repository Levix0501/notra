import { BookEntity, DocEntity } from '@prisma/client';
import { InputJsonValue } from '@prisma/client/runtime/library';
import { cache } from 'react';

import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { Nullable } from '@/types/common';
import { UpdateDocDraftContentDto, UpdateDocMetaDto } from '@/types/doc';

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
					omit: {
						draftContent: true,
						content: true
					},
					include: {
						book: {
							select: {
								slug: true
							}
						}
					}
				});

				return ServiceResult.success(doc);
			} catch (error) {
				logger('DocService.getDocMeta', error);
				const t = getTranslations('services_doc');

				return ServiceResult.fail(t.get_doc_meta_error);
			}
		}
	);

	static readonly getPublishedDocMetaList = cache(
		async ({
			bookSlug,
			page,
			pageSize = 12
		}: {
			bookSlug?: Nullable<BookEntity['slug']>;
			page: number;
			pageSize: number;
		}) => {
			try {
				const docs = await prisma.docEntity.findMany({
					where: {
						book: bookSlug ? { slug: bookSlug } : void 0,
						isPublished: true,
						isDeleted: false
					},
					skip: (page - 1) * pageSize,
					take: pageSize,
					orderBy: {
						updatedAt: 'desc'
					},
					omit: {
						draftContent: true,
						content: true
					},
					include: {
						book: {
							select: {
								slug: true
							}
						}
					}
				});

				return ServiceResult.success(docs);
			} catch (error) {
				logger('DocService.getPublishedDocMetaList', error);
				const t = getTranslations('services_doc');

				return ServiceResult.fail(t.get_published_doc_meta_list_error);
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

	static readonly getPublishedDoc = cache(
		async (bookSlug: BookEntity['slug'], docSlug: DocEntity['slug']) => {
			try {
				const doc = await prisma.docEntity.findFirst({
					where: {
						slug: docSlug,
						book: {
							slug: bookSlug
						},
						isPublished: true,
						isDeleted: false
					}
				});

				return ServiceResult.success(doc);
			} catch (error) {
				logger('DocService.getPublishedDoc', error);
				const t = getTranslations('services_doc');

				return ServiceResult.fail(t.get_published_doc_error);
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

	static readonly getPublishedDocsByBookSlug = cache(
		async (bookSlug: BookEntity['slug']) => {
			try {
				const docs = await prisma.docEntity.findMany({
					where: {
						book: { slug: bookSlug },
						isPublished: true,
						isDeleted: false
					}
				});

				return ServiceResult.success(docs);
			} catch (error) {
				logger('DocService.getPublishedDocsByBookSlug', error);
				const t = getTranslations('services_doc');

				return ServiceResult.fail(t.get_published_docs_by_book_slug_error);
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

	static async updateDocDraftContent(values: UpdateDocDraftContentDto) {
		try {
			const doc = await prisma.docEntity.update({
				where: { id: values.id },
				data: {
					draftContent: JSON.parse(values.draftContent),
					isUpdated: true
				}
			});

			return ServiceResult.success(doc);
		} catch (error) {
			logger('DocService.updateDocDraftContent', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.update_doc_draft_content_error);
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

	static async publishDoc(docId: DocEntity['id']) {
		try {
			const doc = await prisma.docEntity.findUniqueOrThrow({
				where: { id: docId },
				select: {
					draftContent: true,
					isPublished: true,
					publishedAt: true,
					slug: true,
					book: {
						select: {
							slug: true
						}
					}
				}
			});

			await prisma.docEntity.update({
				where: { id: docId },
				data: {
					isPublished: true,
					isUpdated: false,
					content: doc.draftContent as unknown as InputJsonValue,
					publishedAt: doc.isPublished ? doc.publishedAt : new Date()
				}
			});

			return DocService.getDocMeta(doc.book.slug, doc.slug);
		} catch (error) {
			logger('DocService.publishDoc', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.publish_doc_error);
		}
	}

	static async unpublishDoc(docId: DocEntity['id']) {
		try {
			const doc = await prisma.docEntity.update({
				where: { id: docId },
				data: { isPublished: false },
				include: {
					book: {
						select: {
							slug: true
						}
					}
				}
			});

			return DocService.getDocMeta(doc.book.slug, doc.slug);
		} catch (error) {
			logger('DocService.unpublishDoc', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.unpublish_doc_error);
		}
	}
}
