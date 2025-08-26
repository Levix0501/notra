import {
	BookEntity,
	CatalogNodeEntity,
	Prisma,
	PrismaClient
} from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

type Tx = Omit<
	PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
	'$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

const checkShouldMoveNode = async (
	tx: Tx,
	{
		nodeId,
		newParentId,
		newPrevId
	}: {
		nodeId: CatalogNodeEntity['id'];
		newParentId: CatalogNodeEntity['parentId'];
		newPrevId: CatalogNodeEntity['prevId'];
	}
) => {
	const node = await tx.catalogNodeEntity.findUnique({
		where: { id: nodeId }
	});

	return {
		shouldUpdateNode:
			node?.parentId !== newParentId || node?.prevId !== newPrevId,
		node
	};
};

const removeNodeFromOldPosition = async (tx: Tx, node: CatalogNodeEntity) => {
	if (node.parentId === node.prevId) {
		await Promise.all([
			node.parentId
				? tx.catalogNodeEntity.update({
						where: { id: node.parentId },
						data: { childId: node.siblingId }
					})
				: null,
			node.siblingId
				? tx.catalogNodeEntity.update({
						where: { id: node.siblingId },
						data: { prevId: node.prevId }
					})
				: null
		]);
	} else {
		await Promise.all([
			node.prevId
				? tx.catalogNodeEntity.update({
						where: { id: node.prevId },
						data: { siblingId: node.siblingId }
					})
				: null,
			node.siblingId
				? tx.catalogNodeEntity.update({
						where: { id: node.siblingId },
						data: { prevId: node.prevId }
					})
				: null
		]);
	}
};

const deleteChildren = async (tx: Tx, nodeId: CatalogNodeEntity['id']) => {
	const children = await tx.catalogNodeEntity.findMany({
		where: { parentId: nodeId }
	});

	await Promise.all([
		...children.map((child) => deleteChildren(tx, child.id)),
		tx.catalogNodeEntity.deleteMany({
			where: { parentId: nodeId }
		})
	]);
};

export const deleteNodeWithChildren = async (
	tx: Tx,
	nodeId: CatalogNodeEntity['id']
) => {
	const [deletedNode] = await Promise.all([
		tx.catalogNodeEntity.delete({
			where: { id: nodeId }
		}),
		deleteChildren(tx, nodeId)
	]);

	if (deletedNode.docId) {
		await tx.docEntity.update({
			where: { id: deletedNode.docId },
			data: { isDeleted: true }
		});
	}

	await removeNodeFromOldPosition(tx, deletedNode);
};

const prependChild = async (
	tx: Tx,
	{
		bookId,
		node,
		newParentId,
		newPrevId
	}: {
		bookId: BookEntity['id'];
		node: CatalogNodeEntity;
		newParentId: CatalogNodeEntity['parentId'];
		newPrevId: CatalogNodeEntity['prevId'];
	}
) => {
	if (newParentId) {
		const newParentNode = await tx.catalogNodeEntity.findUnique({
			where: { id: newParentId }
		});

		if (!newParentNode) {
			return;
		}

		await Promise.all([
			newParentId
				? tx.catalogNodeEntity.update({
						where: { id: newParentId },
						data: { childId: node.id }
					})
				: null,
			tx.catalogNodeEntity.update({
				where: { id: node.id },
				data: {
					parentId: newParentId,
					prevId: newPrevId,
					siblingId: newParentNode.childId
				}
			}),
			newParentNode.childId
				? tx.catalogNodeEntity.update({
						where: { id: newParentNode.childId },
						data: { prevId: node.id }
					})
				: null
		]);
	} else {
		const firstChildOfRoot = await tx.catalogNodeEntity.findFirst({
			where: {
				bookId,
				parentId: null,
				prevId: null
			}
		});

		await Promise.all([
			tx.catalogNodeEntity.update({
				where: { id: node.id },
				data: {
					parentId: null,
					prevId: null,
					siblingId: firstChildOfRoot?.id
				}
			}),
			firstChildOfRoot?.id
				? tx.catalogNodeEntity.update({
						where: { id: firstChildOfRoot.id },
						data: { prevId: node.id }
					})
				: null
		]);
	}
};

const moveAfter = async (
	tx: Tx,
	{
		node,
		newPrevId
	}: {
		bookId: BookEntity['id'];
		node: CatalogNodeEntity;
		newParentId: CatalogNodeEntity['parentId'];
		newPrevId: CatalogNodeEntity['prevId'];
	}
) => {
	if (newPrevId === null) {
		return;
	}

	const newPrevNode = await tx.catalogNodeEntity.findUnique({
		where: { id: newPrevId }
	});

	if (!newPrevNode) {
		return;
	}

	await Promise.all([
		tx.catalogNodeEntity.update({
			where: { id: newPrevId },
			data: { siblingId: node.id }
		}),
		tx.catalogNodeEntity.update({
			where: { id: node.id },
			data: {
				parentId: newPrevNode.parentId,
				prevId: newPrevNode.id,
				siblingId: newPrevNode.siblingId
			}
		}),
		newPrevNode.siblingId
			? tx.catalogNodeEntity.update({
					where: { id: newPrevNode.siblingId },
					data: { prevId: node.id }
				})
			: null
	]);
};

const insertNodeIntoNewPosition = async (
	tx: Tx,
	{
		bookId,
		node,
		newParentId,
		newPrevId
	}: {
		bookId: BookEntity['id'];
		node: CatalogNodeEntity;
		newParentId: CatalogNodeEntity['parentId'];
		newPrevId: CatalogNodeEntity['prevId'];
	}
) => {
	if (newParentId === newPrevId) {
		await prependChild(tx, {
			bookId,
			node,
			newParentId,
			newPrevId
		});
	} else {
		await moveAfter(tx, {
			bookId,
			node,
			newParentId,
			newPrevId
		});
	}
};

export const moveNode = async (
	tx: Tx,
	{
		bookId,
		nodeId,
		newParentId,
		newPrevId
	}: {
		bookId: BookEntity['id'];
		nodeId: CatalogNodeEntity['id'];
		newParentId: CatalogNodeEntity['parentId'];
		newPrevId: CatalogNodeEntity['prevId'];
	}
) => {
	const { shouldUpdateNode, node } = await checkShouldMoveNode(tx, {
		nodeId,
		newParentId,
		newPrevId
	});

	if (!shouldUpdateNode || !node) {
		return;
	}

	await removeNodeFromOldPosition(tx, node);
	await insertNodeIntoNewPosition(tx, {
		bookId,
		node,
		newParentId,
		newPrevId
	});
};
