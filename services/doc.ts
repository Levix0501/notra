import { BookEntity, BookType, DocEntity } from '@prisma/client';
import { cache } from 'react';

import { getTranslations } from '@/i18n';
import { revalidateDoc } from '@/lib/cache';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import {
	CheckDocSlugDto,
	UpdateDocContentDto,
	UpdateDocMetaDto
} from '@/types/doc';

export class DocService {
	static readonly getPublishedBlogs = cache(
		async ({
			bookId,
			page,
			pageSize
		}: {
			bookId?: BookEntity['id'];
			page: number;
			pageSize: number;
		}) => {
			try {
				const blogs = await prisma.docEntity.findMany({
					where: {
						bookId,
						isPublished: true,
						isDeleted: false,
						book: {
							type: BookType.BLOGS,
							isPublished: true
						}
					},
					skip: (page - 1) * pageSize,
					take: pageSize,
					orderBy: {
						publishedAt: 'desc'
					},
					omit: {
						content: true,
						isPublished: true,
						isDeleted: true,
						createdAt: true,
						updatedAt: true
					},
					include: {
						book: {
							select: {
								slug: true
							}
						}
					}
				});

				return ServiceResult.success(blogs);
			} catch (error) {
				logger('DocService.getPublishedBlogs', error);
				const t = getTranslations('services_doc');

				return ServiceResult.fail(t.get_published_blogs_error);
			}
		}
	);

	static readonly getPublishedBlogsCount = cache(
		async ({ bookId }: { bookId?: BookEntity['id'] }) => {
			try {
				const total = await prisma.docEntity.count({
					where: {
						bookId,
						isPublished: true,
						isDeleted: false,
						book: {
							type: BookType.BLOGS,
							isPublished: true
						}
					}
				});

				return ServiceResult.success(total);
			} catch (error) {
				logger('DocService.getPublishedBlogsCount', error);
				const t = getTranslations('services_doc');

				return ServiceResult.fail(t.get_published_blogs_count_error);
			}
		}
	);

	static readonly getPublishedBlog = cache(async (id: DocEntity['id']) => {
		try {
			const doc = await prisma.docEntity.findUniqueOrThrow({
				where: { id },
				omit: {
					content: true,
					isPublished: true,
					isDeleted: true,
					createdAt: true,
					updatedAt: true
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
			logger('DocService.getPublishedBlog', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.get_published_blog_error);
		}
	});

	static readonly getAllDocsMeta = cache(async () => {
		try {
			const docs = await prisma.docEntity.findMany({
				where: {
					isDeleted: false
				},
				omit: {
					content: true
				},
				include: {
					book: {
						select: {
							slug: true,
							type: true
						}
					}
				}
			});

			return ServiceResult.success(docs);
		} catch (error) {
			logger('DocService.getAllDocsMeta', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.get_all_docs_meta_error);
		}
	});

	static readonly getDocMeta = cache(async (docId: DocEntity['id']) => {
		try {
			const doc = await prisma.docEntity.findUniqueOrThrow({
				where: {
					id: docId
				},
				omit: {
					content: true
				},
				include: {
					book: {
						select: {
							slug: true,
							type: true
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
	});

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
					await tx.treeNodeEntity.update({
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

			return DocService.getDocMeta(doc.id);
		} catch (error) {
			logger('DocService.updateDocMeta', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.update_doc_meta_error);
		}
	}

	static async updateDocContent(values: UpdateDocContentDto) {
		try {
			const doc = await prisma.docEntity.update({
				where: { id: values.id },
				data: {
					content: JSON.parse(values.content)
				},
				include: {
					book: {
						select: {
							slug: true
						}
					}
				}
			});

			if (doc.isPublished) {
				revalidateDoc({
					bookId: doc.bookId,
					bookSlug: doc.book.slug,
					docId: doc.id,
					docSlug: doc.slug
				});
			}

			return ServiceResult.success(doc);
		} catch (error) {
			logger('DocService.updateDocContent', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.update_doc_content_error);
		}
	}

	static readonly getDoc = cache(async (docId: DocEntity['id']) => {
		try {
			const doc = await prisma.docEntity.findUniqueOrThrow({
				where: {
					id: docId
				}
			});

			return ServiceResult.success(doc);
		} catch (error) {
			logger('DocService.getDoc', error);
			const t = getTranslations('services_doc');

			return ServiceResult.fail(t.get_doc_error);
		}
	});

	static readonly checkDocSlug = async ({
		bookId,
		docSlug
	}: CheckDocSlugDto) => {
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

	static readonly getPublishedPageBySlug = cache(
		async (slug: DocEntity['slug']) => {
			try {
				const doc = await prisma.docEntity.findFirst({
					where: {
						slug,
						isPublished: true,
						isDeleted: false,
						book: {
							type: BookType.PAGES,
							isPublished: true
						}
					}
				});

				return ServiceResult.success(doc);
			} catch (error) {
				logger('DocService.getPublishedPageBySlug', error);
				const t = getTranslations('services_doc');

				return ServiceResult.fail(t.get_published_page_by_slug_error);
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
							slug: bookSlug,
							isPublished: true
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
