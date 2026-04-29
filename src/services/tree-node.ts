import {
	BookEntity,
	BookType,
	DocEntity,
	TreeNodeEntity,
	TreeNodeType
} from '@prisma/client';
import { cache } from 'react';

import { getTranslations } from '@/i18n';
import { revalidateAll, revalidateDashboardBook } from '@/lib/cache';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { moveNode, removeNodeFromOldPosition } from '@/lib/tree/server';
import { flattenTreeNodeNodes } from '@/lib/tree/shared';
import {
	CreateContactInfoDto,
	CreateNavItemDto,
	CreateTreeNodeDto,
	DeleteTreeNodeWithChildrenDto,
	MoveAfterDto,
	NavItemVo,
	PrependChildDto,
	UpdateContactInfoDto,
	UpdateNavItemDto,
	UpdateTreeNodeTitleDto
} from '@/types/tree-node';

const t = getTranslations('services_tree_node');

export class TreeNodeService {
	static readonly getPublishedTreeNodesByBookId = cache(
		async (bookId: BookEntity['id']) => {
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
	);

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

	static async updateTitle({ id, title }: UpdateTreeNodeTitleDto) {
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
	}: DeleteTreeNodeWithChildrenDto) {
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

	static async prependChild({ bookId, nodeId, targetId }: PrependChildDto) {
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

	static async moveAfter({ bookId, nodeId, targetId }: MoveAfterDto) {
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

	static async publishTreeNodes(bookId: BookEntity['id']) {
		try {
			await prisma.treeNodeEntity.updateMany({
				where: { bookId },
				data: { isPublished: true }
			});

			revalidateAll();

			return ServiceResult.success(null);
		} catch (error) {
			logger('TreeNodeService.publishTreeNodes', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.publish_tree_nodes_error);
		}
	}

	static readonly getPublishedNavItems = cache(async () => {
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
	});

	static async createContactInfo({ bookId, url, icon }: CreateContactInfoDto) {
		try {
			const lastNode = await prisma.treeNodeEntity.findFirst({
				where: {
					bookId,
					parentId: null,
					siblingId: null
				}
			});

			const node = await prisma.$transaction(async (tx) => {
				const node = await tx.treeNodeEntity.create({
					data: {
						title: '',
						type: TreeNodeType.LINK,
						bookId,
						prevId: lastNode ? lastNode.id : null,
						url,
						isExternal: true,
						icon
					}
				});

				if (lastNode) {
					await tx.treeNodeEntity.update({
						where: { id: lastNode.id },
						data: { siblingId: node.id }
					});
				}

				return node;
			});

			return ServiceResult.success(node);
		} catch (error) {
			logger('TreeNodeService.createContactInfo', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.create_contact_info_error);
		}
	}

	static async updateContactInfo({ id, url, icon }: UpdateContactInfoDto) {
		try {
			const node = await prisma.treeNodeEntity.update({
				where: { id },
				data: { url, icon }
			});

			if (node.isPublished) {
				revalidateAll();
			}

			return ServiceResult.success(node);
		} catch (error) {
			logger('TreeNodeService.updateContactInfo', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.update_contact_info_error);
		}
	}

	static readonly getPublishedContactInfo = cache(async () => {
		try {
			const nodes = await prisma.treeNodeEntity.findMany({
				where: { book: { type: BookType.CONTACT } }
			});

			const treeNodes = flattenTreeNodeNodes(nodes).filter(
				(node) => node.isPublished && node.level === 0
			);

			return ServiceResult.success(treeNodes);
		} catch (error) {
			logger('TreeNodeService.getPublishedContactInfo', error);
			const t = getTranslations('services_tree_node');

			return ServiceResult.fail(t.get_published_contact_info_error);
		}
	});
}
