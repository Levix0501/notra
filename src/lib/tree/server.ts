import {
	BookEntity,
	TreeNodeEntity,
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
		nodeId: TreeNodeEntity['id'];
		newParentId: TreeNodeEntity['parentId'];
		newPrevId: TreeNodeEntity['prevId'];
	}
) => {
	const node = await tx.treeNodeEntity.findUnique({
		where: { id: nodeId }
	});

	return {
		shouldUpdateNode:
			node?.parentId !== newParentId || node?.prevId !== newPrevId,
		node
	};
};

export const removeNodeFromOldPosition = async (
	tx: Tx,
	node: TreeNodeEntity
) => {
	if (node.parentId === node.prevId) {
		await Promise.all([
			node.parentId
				? tx.treeNodeEntity.update({
						where: { id: node.parentId },
						data: { childId: node.siblingId }
					})
				: null,
			node.siblingId
				? tx.treeNodeEntity.update({
						where: { id: node.siblingId },
						data: { prevId: node.prevId }
					})
				: null
		]);
	} else {
		await Promise.all([
			node.prevId
				? tx.treeNodeEntity.update({
						where: { id: node.prevId },
						data: { siblingId: node.siblingId }
					})
				: null,
			node.siblingId
				? tx.treeNodeEntity.update({
						where: { id: node.siblingId },
						data: { prevId: node.prevId }
					})
				: null
		]);
	}
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
		node: TreeNodeEntity;
		newParentId: TreeNodeEntity['parentId'];
		newPrevId: TreeNodeEntity['prevId'];
	}
) => {
	if (newParentId) {
		const newParentNode = await tx.treeNodeEntity.findUnique({
			where: { id: newParentId }
		});

		if (!newParentNode) {
			return;
		}

		await Promise.all([
			newParentId
				? tx.treeNodeEntity.update({
						where: { id: newParentId },
						data: { childId: node.id }
					})
				: null,
			tx.treeNodeEntity.update({
				where: { id: node.id },
				data: {
					parentId: newParentId,
					prevId: newPrevId,
					siblingId: newParentNode.childId
				}
			}),
			newParentNode.childId
				? tx.treeNodeEntity.update({
						where: { id: newParentNode.childId },
						data: { prevId: node.id }
					})
				: null
		]);
	} else {
		const firstChildOfRoot = await tx.treeNodeEntity.findFirst({
			where: {
				bookId,
				parentId: null,
				prevId: null
			}
		});

		await Promise.all([
			tx.treeNodeEntity.update({
				where: { id: node.id },
				data: {
					parentId: null,
					prevId: null,
					siblingId: firstChildOfRoot?.id
				}
			}),
			firstChildOfRoot?.id
				? tx.treeNodeEntity.update({
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
		node: TreeNodeEntity;
		newParentId: TreeNodeEntity['parentId'];
		newPrevId: TreeNodeEntity['prevId'];
	}
) => {
	if (newPrevId === null) {
		return;
	}

	const newPrevNode = await tx.treeNodeEntity.findUnique({
		where: { id: newPrevId }
	});

	if (!newPrevNode) {
		return;
	}

	await Promise.all([
		tx.treeNodeEntity.update({
			where: { id: newPrevId },
			data: { siblingId: node.id }
		}),
		tx.treeNodeEntity.update({
			where: { id: node.id },
			data: {
				parentId: newPrevNode.parentId,
				prevId: newPrevNode.id,
				siblingId: newPrevNode.siblingId
			}
		}),
		newPrevNode.siblingId
			? tx.treeNodeEntity.update({
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
		node: TreeNodeEntity;
		newParentId: TreeNodeEntity['parentId'];
		newPrevId: TreeNodeEntity['prevId'];
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
		nodeId: TreeNodeEntity['id'];
		newParentId: TreeNodeEntity['parentId'];
		newPrevId: TreeNodeEntity['prevId'];
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
