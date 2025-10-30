import {
	BookEntity,
	BookType,
	DocEntity,
	TreeNodeEntity,
	TreeNodeType
} from '@prisma/client';

import { getTranslations } from '@/i18n';
import { revalidateAll, revalidateDashboardBook } from '@/lib/cache';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { moveNode, removeNodeFromOldPosition } from '@/lib/tree/server';
import { flattenTreeNodeNodes } from '@/lib/tree/shared';
import { Nullable } from '@/types/common';
import {
	CreateNavItemDto,
	CreateTreeNodeDto,
	NavItemVo,
	UpdateNavItemDto
} from '@/types/tree-node';

const t = getTranslations('services_tree_node');

export class TreeNodeService {
	static async getPublishedTreeNodesByBookId(bookId: BookEntity['id']) {
		try {
			const nodes = await prisma.treeNodeEntity.findMany({
				where: {
					bookId,
					book: { isPublished: true }
				},
				omit: {
					createdAt: true,
					updatedAt: true,
					bookId: true
				}
			});

			return ServiceResult.success(
				flattenTreeNodeNodes(nodes).filter((node) => node.isPublished)
			);
		} catch (error) {
			logger('TreeNodeService.getPublishedTreeNodesByBookId', error);

			return ServiceResult.fail(t.get_published_tree_nodes_by_book_id_error);
		}
	}

	static async getTreeNodesByBookId(bookId: BookEntity['id']) {
		try {
			const nodes = await prisma.treeNodeEntity.findMany({
				where: {
					bookId
				},
				omit: {
					createdAt: true,
					updatedAt: true,
					bookId: true
				}
			});

			return ServiceResult.success(flattenTreeNodeNodes(nodes));
		} catch (error) {
			logger('TreeNodeService.getTreeNodesByBookId', error);

			return ServiceResult.fail(t.get_tree_nodes_by_book_id_error);
		}
	}

	static async createTreeNode({ parentId, type, bookId }: CreateTreeNodeDto) {
		try {
			const parentNode = parentId
				? await prisma.treeNodeEntity.findUnique({
						where: {
							id: parentId
						}
					})
				: null;

			const firstNode = await prisma.treeNodeEntity.findFirst({
				where: {
					bookId,
					parentId,
					prevId: parentId
				}
			});

			const node = await prisma.$transaction(async (tx) => {
				let doc =
					type === TreeNodeType.DOC
						? await tx.docEntity.create({
								data: {
									title: t.new_doc_default_name,
									bookId
								}
							})
						: null;

				if (doc) {
					doc = await tx.docEntity.update({
						where: { id: doc.id },
						data: {
							slug: (doc.id * 10000).toString(36)
						}
					});
				}

				const node = await tx.treeNodeEntity.create({
					data: {
						title:
							type === TreeNodeType.GROUP
								? t.new_group_default_name
								: t.new_doc_default_name,
						type,
						bookId,
						parentId: parentNode ? parentNode.id : null,
						prevId: parentNode ? parentNode.id : null,
						siblingId: firstNode ? firstNode.id : null,
						docId: doc?.id ?? null,
						url: doc?.slug ?? null
					}
				});

				if (firstNode) {
					await tx.treeNodeEntity.update({
						where: { id: firstNode.id },
						data: { prevId: node.id }
					});
				}

				if (parentNode) {
					await tx.treeNodeEntity.update({
						where: { id: parentNode.id },
						data: { childId: node.id }
					});
				}

				return node;
			});

			if (type === TreeNodeType.DOC) {
				revalidateDashboardBook();
			}

			return ServiceResult.success(node);
		} catch (error) {
			logger('TreeNodeService.createNode', error);

			if (type === TreeNodeType.DOC) {
				logger('TreeNodeService.createDoc', error);

				return ServiceResult.fail(t.create_doc_error);
			} else {
				logger('TreeNodeService.createGroup', error);

				return ServiceResult.fail(t.create_group_error);
			}
		}
	}

	static async updateTitle({
		id,
		title
	}: {
		id: TreeNodeEntity['id'];
		title: TreeNodeEntity['title'];
	}) {
		try {
			const node = await prisma.$transaction(async (tx) => {
				const node = await tx.treeNodeEntity.update({
					where: { id },
					data: { title }
				});

				if (node.docId !== null) {
					revalidateAll();
				}

				return node;
			});

			return TreeNodeService.getTreeNodesByBookId(node.bookId);
		} catch (error) {
			logger('TreeNodeService.updateTitle', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.update_title_error);
		}
	}

	static async deleteWithChildren({
		nodeId,
		nodeIds,
		docIds,
		bookId
	}: {
		nodeId: TreeNodeEntity['id'];
		nodeIds: TreeNodeEntity['id'][];
		docIds: DocEntity['id'][];
		bookId: BookEntity['id'];
	}) {
		try {
			await prisma.$transaction(async (tx) => {
				const node = await tx.treeNodeEntity.findUniqueOrThrow({
					where: { id: nodeId }
				});

				await Promise.all([
					removeNodeFromOldPosition(tx, node),
					tx.treeNodeEntity.deleteMany({ where: { id: { in: nodeIds } } }),
					tx.docEntity.updateMany({
						where: { id: { in: docIds } },
						data: { isDeleted: true }
					})
				]);
			});

			revalidateAll();

			return TreeNodeService.getTreeNodesByBookId(bookId);
		} catch (error) {
			logger('TreeNodeService.deleteWithChildren', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.delete_with_children_error);
		}
	}

	static async prependChild({
		bookId,
		nodeId,
		targetId
	}: {
		bookId: TreeNodeEntity['bookId'];
		nodeId: TreeNodeEntity['id'];
		targetId: Nullable<TreeNodeEntity['id']>;
	}) {
		try {
			await prisma.$transaction(async (tx) => {
				await moveNode(tx, {
					bookId,
					nodeId,
					newParentId: targetId ?? null,
					newPrevId: targetId ?? null
				});
			});

			revalidateAll();

			return TreeNodeService.getTreeNodesByBookId(bookId);
		} catch (error) {
			logger('TreeNodeService.prependChild', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.prepend_child_error);
		}
	}

	static async moveAfter({
		bookId,
		nodeId,
		targetId
	}: {
		bookId: TreeNodeEntity['bookId'];
		nodeId: TreeNodeEntity['id'];
		targetId: TreeNodeEntity['id'];
	}) {
		try {
			await prisma.$transaction(async (tx) => {
				const newPrevNode = await tx.treeNodeEntity.findUnique({
					where: {
						id: targetId
					}
				});

				await moveNode(tx, {
					bookId,
					nodeId,
					newParentId: newPrevNode?.parentId ?? null,
					newPrevId: targetId || null
				});
			});

			revalidateAll();

			return TreeNodeService.getTreeNodesByBookId(bookId);
		} catch (error) {
			logger('TreeNodeService.moveAfter', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.move_after_error);
		}
	}

	static async publish({
		nodeIds,
		docIds,
		bookId
	}: {
		nodeIds: TreeNodeEntity['id'][];
		docIds: DocEntity['id'][];
		bookId: BookEntity['id'];
	}) {
		try {
			await prisma.$transaction(async (tx) => {
				await Promise.all([
					tx.treeNodeEntity.updateMany({
						where: { id: { in: nodeIds } },
						data: { isPublished: true }
					}),
					tx.docEntity.updateMany({
						where: { id: { in: docIds } },
						data: { isPublished: true }
					}),
					tx.bookEntity.update({
						where: { id: bookId },
						data: { isPublished: true }
					})
				]);
			});

			revalidateAll();

			return TreeNodeService.getTreeNodesByBookId(bookId);
		} catch (error) {
			logger('TreeNodeService.publish', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.publish_error);
		}
	}

	static async unpublish({
		nodeIds,
		docIds,
		bookId
	}: {
		nodeIds: TreeNodeEntity['id'][];
		docIds: DocEntity['id'][];
		bookId: BookEntity['id'];
	}) {
		try {
			await prisma.$transaction(async (tx) => {
				await Promise.all([
					tx.treeNodeEntity.updateMany({
						where: { id: { in: nodeIds } },
						data: { isPublished: false }
					}),
					tx.docEntity.updateMany({
						where: { id: { in: docIds } },
						data: { isPublished: false }
					})
				]);
			});

			revalidateAll();

			return TreeNodeService.getTreeNodesByBookId(bookId);
		} catch (error) {
			logger('TreeNodeService.unpublish', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.unpublish_error);
		}
	}

	static async createNavItem({
		parentId,
		type,
		bookId,
		title,
		url,
		isExternal
	}: CreateNavItemDto) {
		try {
			const parentNode = parentId
				? await prisma.treeNodeEntity.findUnique({
						where: {
							id: parentId
						}
					})
				: null;

			const firstNode = await prisma.treeNodeEntity.findFirst({
				where: {
					bookId,
					parentId,
					prevId: parentId
				}
			});

			const node = await prisma.$transaction(async (tx) => {
				const node = await tx.treeNodeEntity.create({
					data: {
						title,
						type,
						bookId,
						parentId: parentNode ? parentNode.id : null,
						prevId: parentNode ? parentNode.id : null,
						siblingId: firstNode ? firstNode.id : null,
						url,
						isExternal
					}
				});

				if (firstNode) {
					await tx.treeNodeEntity.update({
						where: { id: firstNode.id },
						data: { prevId: node.id }
					});
				}

				if (parentNode) {
					await tx.treeNodeEntity.update({
						where: { id: parentNode.id },
						data: { childId: node.id }
					});
				}

				return node;
			});

			return ServiceResult.success(node);
		} catch (error) {
			logger('TreeNodeService.createNavItem', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.create_nav_item_error);
		}
	}

	static async updateNavItem({
		id,
		type,
		title,
		url,
		isExternal
	}: UpdateNavItemDto) {
		try {
			const node = await prisma.treeNodeEntity.update({
				where: { id },
				data: { type, title, url, isExternal }
			});

			if (node.isPublished) {
				revalidateAll();
			}

			return ServiceResult.success(node);
		} catch (error) {
			logger('TreeNodeService.updateNavItem', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.update_nav_item_error);
		}
	}

	static async publishNavbar(bookId: BookEntity['id']) {
		try {
			await prisma.treeNodeEntity.updateMany({
				where: { bookId, book: { type: BookType.NAVBAR } },
				data: { isPublished: true }
			});

			revalidateAll();

			return ServiceResult.success(null);
		} catch (error) {
			logger('TreeNodeService.publishNavbar', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.publish_navbar_error);
		}
	}

	static async getPublishedNavItems() {
		try {
			const nodes = await prisma.treeNodeEntity.findMany({
				where: { book: { type: BookType.NAVBAR } }
			});

			const treeNodes = flattenTreeNodeNodes(nodes).filter(
				(node) => node.isPublished && node.level <= 1
			);

			const getChildren = (
				parentId: TreeNodeEntity['parentId']
			): NavItemVo[] => {
				const children = treeNodes.filter(
					(child) => child.parentId === parentId
				);

				return children.map((child) => ({
					...child,
					children: getChildren(child.id)
				}));
			};

			const navItems = getChildren(null);

			return ServiceResult.success(navItems);
		} catch (error) {
			logger('TreeNodeService.getPublishedNavItems', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.get_published_nav_items_error);
		}
	}
}
