import { BookEntity, DocEntity } from '@prisma/client';
import { InputJsonValue } from '@prisma/client/runtime/library';
import { cache } from 'react';

import { getTranslations } from '@/i18n';
import { revalidateBook, revalidateDoc } from '@/lib/cache';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { UpdateDocDraftContentDto, UpdateDocMetaDto } from '@/types/doc';

export default class DocService {
	static readonly getDocMeta = cache(
		async (bookId: BookEntity['id'], docId: DocEntity['id']) => {
			try {
				const doc = await prisma.docEntity.findFirst({
					where: {
						id: docId,
						bookId
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

	static readonly getPublishedDocTotalCount = cache(
		async ({ bookId }: { bookId?: BookEntity['id'] }) => {
			try {
				const count = await prisma.docEntity.count({
					where: {
						bookId,
						isPublished: true,
						isDeleted: false
					}
				});

				return ServiceResult.success(count);
			} catch (error) {
				logger('DocService.getPublishedDocTotalCount', error);
				const t = getTranslations('services_doc');

				return ServiceResult.fail(t.get_published_doc_total_count_error);
			}
		}
	);

	static readonly getPublishedDocMetaList = cache(
		async ({
			bookId,
			page,
			pageSize = 12
		}: {
			bookId?: BookEntity['id'];
			page: number;
			pageSize: number;
		}) => {
			try {
				const docs = await prisma.docEntity.findMany({
					where: {
						bookId,
						isPublished: true,
						isDeleted: false
					},
					skip: (page - 1) * pageSize,
					take: pageSize,
					orderBy: {
						publishedAt: 'desc'
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
		async (bookId: BookEntity['id'], docId: DocEntity['id']) => {
			try {
				const doc = await prisma.docEntity.findFirst({
					where: {
						id: docId,
						bookId
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

	static readonly getDocs = cache(async (bookId: BookEntity['id']) => {
		try {
			const docs = await prisma.docEntity.findMany({
				where: { bookId }
			});

			return ServiceResult.success(docs);
		} catch (error) {
			logger('DocService.getDocs', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.get_docs_error);
		}
	});

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

			revalidateDoc({
				bookId: doc.bookId,
				bookSlug: doc.book.slug,
				docId: doc.id,
				docSlug: doc.slug,
				oldSlug: values.slug
			});

			return DocService.getDocMeta(doc.bookId, doc.id);
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
		bookId: BookEntity['id'],
		docSlug: DocEntity['slug']
	) => {
		try {
			const doc = await prisma.docEntity.findFirst({
				where: { slug: docSlug, bookId }
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
				include: {
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

			if (doc.isPublished) {
				revalidateDoc({
					bookId: doc.bookId,
					bookSlug: doc.book.slug,
					docId: doc.id,
					docSlug: doc.slug
				});
			} else {
				revalidateBook({
					bookId: doc.bookId,
					bookSlug: doc.book.slug
				});
			}

			return DocService.getDocMeta(doc.bookId, doc.id);
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

			revalidateBook({
				bookId: doc.bookId,
				bookSlug: doc.book.slug
			});

			return DocService.getDocMeta(doc.bookId, doc.id);
		} catch (error) {
			logger('DocService.unpublishDoc', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.unpublish_doc_error);
		}
	}

	static async incrementViewCount(docId: DocEntity['id']) {
		try {
			await prisma.docEntity.update({
				where: { id: docId },
				data: { viewCount: { increment: 1 } }
			});

			return ServiceResult.success(null);
		} catch (error) {
			logger('DocService.incrementViewCount', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.increment_view_count_error);
		}
	}
}
