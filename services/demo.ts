import {
	BookEntity,
	DocEntity,
	FileEntity,
	TreeNodeType
} from '@prisma/client';
import { Dexie } from 'dexie';
import limax from 'limax';

import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import { ServiceResult } from '@/lib/service-result';
import { moveNode, removeNodeFromOldPosition } from '@/lib/tree/demo';
import { flattenTreeNodeNodes } from '@/lib/tree/shared';
import { BookVo, CreateBookFormValues, UpdateBookDto } from '@/types/book';
import { DemoDB } from '@/types/demo';
import {
	CheckDocSlugDto,
	DocMetaVo,
	DocVo,
	UpdateDocContentDto,
	UpdateDocMetaDto
} from '@/types/doc';
import {
	CreateTreeNodeDto,
	DeleteTreeNodeWithChildrenDto,
	MoveAfterDto,
	PrependChildDto,
	UpdateTreeNodeTitleDto
} from '@/types/tree-node';

// Create database instance factory to allow proper cleanup in tests
function createDatabase() {
	const db = new Dexie('DemoDatabase') as DemoDB;

	db.version(1).stores({
		books: '++id, name, slug, type, isPublished, createdAt, updatedAt',
		docs: '++id, bookId, slug, isPublished, isDeleted, createdAt, updatedAt, publishedAt',
		treeNodes:
			'++id, bookId, parentId, prevId, siblingId, childId, type, isPublished, docId'
	});

	return db;
}

let db = createDatabase();

// Export function to get database instance (for testing)
export function getDatabase() {
	if (!db.isOpen()) {
		db = createDatabase();
	}

	return db;
}

// Export function to close database (for testing cleanup)
export async function closeDatabase() {
	if (db.isOpen()) {
		db.close();
	}
}

export class DemoService {
	static async createBook({ name }: CreateBookFormValues) {
		const t = getTranslations('services_book');

		try {
			const db = getDatabase();
			const slug = limax(name, { tone: false });
			const existingBook = await db.books.where('slug').equals(slug).first();

			const now = new Date();
			const bookData: Omit<BookEntity, 'id'> = {
				name,
				slug: existingBook ? `${slug}-${Date.now()}` : slug,
				type: 'BLOGS',
				isPublished: false,
				createdAt: now,
				updatedAt: now
			};

			const id = await db.books.add(bookData as BookEntity);
			const book = await db.books.get(id);

			return ServiceResult.success(book);
		} catch (error) {
			logger('DemoService.createBook', error);

			return ServiceResult.fail(t.create_book_error);
		}
	}

	static async getBooks(): Promise<BookVo[]> {
		const db = getDatabase();
		const books = await db.books
			.where('type')
			.anyOf(['BLOGS', 'DOCS'])
			.reverse()
			.sortBy('createdAt');

		return books.map((book) => ({
			id: book.id,
			slug: book.slug,
			name: book.name,
			type: book.type,
			isPublished: book.isPublished
		}));
	}

	static async deleteBook(id: BookEntity['id']) {
		const t = getTranslations('services_book');

		try {
			const db = getDatabase();

			await db.transaction('rw', db.books, db.treeNodes, db.docs, async () => {
				await db.treeNodes.where('bookId').equals(id).delete();
				await db.docs.where('bookId').equals(id).delete();
				await db.books.delete(id);
			});

			return ServiceResult.success(true);
		} catch (error) {
			logger('DemoService.deleteBook', error);

			return ServiceResult.fail(t.delete_book_error);
		}
	}

	static async getBook(bookId: BookEntity['id']): Promise<BookVo | null> {
		const db = getDatabase();
		const book = await db.books.get(bookId);

		if (!book) {
			return null;
		}

		return {
			id: book.id,
			slug: book.slug,
			name: book.name,
			type: book.type,
			isPublished: book.isPublished
		};
	}

	static async updateBook({ id, ...values }: UpdateBookDto) {
		const t = getTranslations('services_book');

		try {
			const db = getDatabase();

			await db.books.update(id, values);

			return ServiceResult.success(true);
		} catch (error) {
			logger('DemoService.updateBook', error);

			return ServiceResult.fail(t.update_book_error);
		}
	}

	static async checkBookSlug(slug: BookEntity['slug']) {
		const t = getTranslations('services_book');

		try {
			const db = getDatabase();
			const existingBook = await db.books.where('slug').equals(slug).first();

			return ServiceResult.success(!existingBook);
		} catch (error) {
			logger('DemoService.checkBookSlug', error);

			return ServiceResult.fail(t.check_book_slug_error);
		}
	}

	static async createTreeNode({ parentId, type, bookId }: CreateTreeNodeDto) {
		const t = getTranslations('services_tree_node');

		try {
			const db = getDatabase();
			const node = await db.transaction(
				'rw',
				db.treeNodes,
				db.docs,
				async () => {
					const parentNode = parentId ? await db.treeNodes.get(parentId) : null;

					const firstNode = await db.treeNodes
						.where('bookId')
						.equals(bookId)
						.and(
							(node) =>
								node.parentId === parentId && node.prevId === (parentId ?? null)
						)
						.first();

					let doc: DocEntity | undefined;

					if (type === TreeNodeType.DOC) {
						const now = new Date();

						const docId = await db.docs.add({
							title: t.new_doc_default_name,
							slug: `doc-${Date.now()}`,
							content: null,
							cover: null,
							summary: null,
							viewCount: 0,
							isPublished: false,
							isDeleted: false,
							createdAt: now,
							updatedAt: now,
							publishedAt: now,
							bookId
						});

						doc = await db.docs.get(docId);
					}

					const now = new Date();

					const id = await db.treeNodes.add({
						parentId: parentNode?.id ?? null,
						prevId: parentNode?.id ?? null,
						siblingId: firstNode?.id ?? null,
						childId: null,
						type,
						title:
							type === TreeNodeType.GROUP
								? t.new_group_default_name
								: t.new_doc_default_name,
						url: doc?.slug ?? null,
						icon: null,
						isPublished: false,
						isExternal: false,
						createdAt: now,
						updatedAt: now,
						bookId,
						docId: doc?.id ?? null
					});

					if (firstNode) {
						await db.treeNodes.update(firstNode.id, { prevId: id });
					}

					if (parentNode) {
						await db.treeNodes.update(parentNode.id, { childId: id });
					}

					return await db.treeNodes.get(id);
				}
			);

			return ServiceResult.success(node);
		} catch (error) {
			logger('DemoService.createTreeNode', error);

			if (type === TreeNodeType.DOC) {
				logger('DemoService.createDoc', error);

				return ServiceResult.fail(t.create_doc_error);
			} else {
				logger('DemoService.createGroup', error);

				return ServiceResult.fail(t.create_group_error);
			}
		}
	}

	static async getTreeNodesByBookId(bookId: BookEntity['id']) {
		const db = getDatabase();
		const nodes = await db.treeNodes.where('bookId').equals(bookId).toArray();

		return flattenTreeNodeNodes(nodes);
	}

	static async deleteTreeNodeWithChildren(dto: DeleteTreeNodeWithChildrenDto) {
		const t = getTranslations('services_tree_node');

		try {
			const db = getDatabase();

			await db.transaction('rw', db.treeNodes, db.docs, async () => {
				const node = await db.treeNodes.get(dto.nodeId);

				if (!node) {
					throw new Error('Node not found');
				}

				await removeNodeFromOldPosition(db, node);
				await db.treeNodes.bulkDelete(dto.nodeIds);

				for (const docId of dto.docIds) {
					await db.docs.update(docId, { isDeleted: true });
				}
			});

			const nodes = await DemoService.getTreeNodesByBookId(dto.bookId);

			return ServiceResult.success(nodes);
		} catch (error) {
			console.error('DemoService.deleteTreeNodeWithChildren', error);

			return ServiceResult.fail(t.delete_with_children_error);
		}
	}

	static async prependChild({ bookId, nodeId, targetId }: PrependChildDto) {
		const t = getTranslations('services_tree_node');

		try {
			const db = getDatabase();

			await db.transaction('rw', db.treeNodes, async () => {
				await moveNode(db, {
					bookId,
					nodeId,
					newParentId: targetId ?? null,
					newPrevId: targetId ?? null
				});
			});

			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			return ServiceResult.success(nodes);
		} catch (error) {
			console.error('DemoService.prependChild', error);

			return ServiceResult.fail(t.prepend_child_error);
		}
	}

	static async moveAfter({ bookId, nodeId, targetId }: MoveAfterDto) {
		const t = getTranslations('services_tree_node');

		try {
			const db = getDatabase();

			await db.transaction('rw', db.treeNodes, async () => {
				const newPrevNode = await db.treeNodes.get(targetId);

				await moveNode(db, {
					bookId,
					nodeId,
					newParentId: newPrevNode?.parentId ?? null,
					newPrevId: targetId || null
				});
			});

			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			return ServiceResult.success(nodes);
		} catch (error) {
			console.error('DemoService.moveAfter', error);

			return ServiceResult.fail(t.move_after_error);
		}
	}

	static async updateTreeNodeTitle({ id, title }: UpdateTreeNodeTitleDto) {
		const t = getTranslations('services_tree_node');

		try {
			const db = getDatabase();

			const node = await db.transaction(
				'rw',
				db.treeNodes,
				db.docs,
				async () => {
					await db.treeNodes.update(id, { title });
					const node = await db.treeNodes.get(id);

					if (!node) {
						throw new Error('Node not found');
					}

					if (node.docId !== null) {
						await db.docs.update(node.docId, { title });
					}

					return node;
				}
			);

			const nodes = await DemoService.getTreeNodesByBookId(node.bookId);

			return ServiceResult.success(nodes);
		} catch (error) {
			logger('DemoService.updateTreeNodeTitle', error);

			return ServiceResult.fail(t.update_title_error);
		}
	}

	static async getDocMeta(docId: DocEntity['id']): Promise<DocMetaVo> {
		const db = getDatabase();

		const doc = await db.docs.get(docId);

		if (!doc) {
			throw new Error('Document not found');
		}

		const book = await db.books.get(doc.bookId);

		if (!book) {
			throw new Error('Book not found');
		}

		return {
			...doc,
			book: {
				slug: book.slug,
				type: book.type
			}
		};
	}

	static async getDoc(docId: DocEntity['id']): Promise<DocVo> {
		const db = getDatabase();
		const doc = await db.docs.get(docId);

		if (!doc) {
			throw new Error('Document not found');
		}

		return doc;
	}

	static async checkDocSlug({ bookId, docSlug }: CheckDocSlugDto) {
		const t = getTranslations('services_doc');

		try {
			const db = getDatabase();
			const doc = await db.docs
				.where('slug')
				.equals(docSlug)
				.and((doc) => doc.bookId === bookId)
				.first();

			return ServiceResult.success(!doc);
		} catch (error) {
			logger('DemoService.checkDocSlug', error);

			return ServiceResult.fail(t.check_doc_slug_error);
		}
	}

	static async uploadFile(file: File): Promise<FileEntity> {
		const base64 = await new Promise<string>((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});

		const { width, height } = await new Promise<{
			width: number;
			height: number;
		}>((resolve) => {
			const img = new Image();

			img.onload = () => {
				resolve({ width: img.naturalWidth, height: img.naturalHeight });
			};

			img.onerror = () => {
				resolve({ width: 0, height: 0 });
			};

			img.src = base64;
		});

		return {
			id: Date.now(),
			url: base64,
			hash: `${Date.now()}`,
			width,
			height,
			mimeType: file.type,
			size: file.size,
			createdAt: new Date(),
			updatedAt: new Date()
		};
	}

	static async updateDocMeta({ id, ...values }: UpdateDocMetaDto) {
		const t = getTranslations('services_doc');

		try {
			const db = getDatabase();

			await db.transaction('rw', db.docs, db.treeNodes, async () => {
				// Update doc metadata
				await db.docs.update(id, values);

				// If title or slug changed, update the corresponding tree node
				if (values.title !== void 0 || values.slug !== void 0) {
					const node = await db.treeNodes.where('docId').equals(id).first();

					if (node) {
						const updateData: Partial<typeof node> = {};

						if (values.title !== void 0) {
							updateData.title = values.title;
						}

						if (values.slug !== void 0) {
							updateData.url = values.slug;
						}

						await db.treeNodes.update(node.id, updateData);
					}
				}
			});

			// Return updated doc metadata
			const docMeta = await DemoService.getDocMeta(id);

			return ServiceResult.success(docMeta);
		} catch (error) {
			logger('DemoService.updateDocMeta', error);

			return ServiceResult.fail(t.update_doc_meta_error);
		}
	}

	static async updateDocContent(values: UpdateDocContentDto) {
		const t = getTranslations('services_doc');

		try {
			const db = getDatabase();

			await db.docs.update(values.id, {
				content: JSON.parse(values.content)
			});

			const doc = await DemoService.getDoc(values.id);

			return ServiceResult.success(doc);
		} catch (error) {
			logger('DemoService.updateDocContent', error);

			return ServiceResult.fail(t.update_doc_content_error);
		}
	}
}
