import { BookEntity, TreeNodeEntity } from '@prisma/client';

import { DemoDB } from '@/types/demo';

/**
 * Check if a node needs to be moved to a new position
 * Returns whether the node should be updated and the node itself
 */
const checkShouldMoveNode = async (
	db: DemoDB,
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
	const node = await db.treeNodes.get(nodeId);

	return {
		shouldUpdateNode:
			node?.parentId !== newParentId || node?.prevId !== newPrevId,
		node
	};
};

/**
 * Remove a node from its current position in the tree structure
 * Updates the parent/sibling relationships to maintain tree integrity
 */
export const removeNodeFromOldPosition = async (
	db: DemoDB,
	node: TreeNodeEntity
) => {
	if (node.parentId === node.prevId) {
		// Node is the first child of its parent
		const updates: Promise<number>[] = [];

		if (node.parentId) {
			updates.push(
				db.treeNodes.update(node.parentId, { childId: node.siblingId })
			);
		}

		if (node.siblingId) {
			updates.push(
				db.treeNodes.update(node.siblingId, { prevId: node.prevId })
			);
		}

		await Promise.all(updates);
	} else {
		// Node is a regular sibling node
		const updates: Promise<number>[] = [];

		if (node.prevId) {
			updates.push(
				db.treeNodes.update(node.prevId, { siblingId: node.siblingId })
			);
		}

		if (node.siblingId) {
			updates.push(
				db.treeNodes.update(node.siblingId, { prevId: node.prevId })
			);
		}

		await Promise.all(updates);
	}
};

/**
 * Insert a node as the first child of a parent node
 * Handles both cases: when parent exists and when inserting at root level
 */
const prependChild = async (
	db: DemoDB,
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
		const newParentNode = await db.treeNodes.get(newParentId);

		if (!newParentNode) {
			return;
		}

		const updates: Promise<number>[] = [];

		if (newParentId) {
			updates.push(db.treeNodes.update(newParentId, { childId: node.id }));
		}

		updates.push(
			db.treeNodes.update(node.id, {
				parentId: newParentId,
				prevId: newPrevId,
				siblingId: newParentNode.childId
			})
		);

		if (newParentNode.childId) {
			updates.push(
				db.treeNodes.update(newParentNode.childId, { prevId: node.id })
			);
		}

		await Promise.all(updates);
	} else {
		const firstChildOfRoot = await db.treeNodes
			.where('bookId')
			.equals(bookId)
			.and((n) => n.parentId === null && n.prevId === null)
			.first();

		const updates: Promise<number>[] = [];

		updates.push(
			db.treeNodes.update(node.id, {
				parentId: null,
				prevId: null,
				siblingId: firstChildOfRoot?.id ?? null
			})
		);

		if (firstChildOfRoot?.id) {
			updates.push(
				db.treeNodes.update(firstChildOfRoot.id, { prevId: node.id })
			);
		}

		await Promise.all(updates);
	}
};

/**
 * Insert a node after another node as a sibling
 * Updates the sibling chain to include the moved node
 */
const moveAfter = async (
	db: DemoDB,
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

	const newPrevNode = await db.treeNodes.get(newPrevId);

	if (!newPrevNode) {
		return;
	}

	const updates: Promise<number>[] = [];

	updates.push(db.treeNodes.update(newPrevId, { siblingId: node.id }));

	updates.push(
		db.treeNodes.update(node.id, {
			parentId: newPrevNode.parentId,
			prevId: newPrevNode.id,
			siblingId: newPrevNode.siblingId
		})
	);

	if (newPrevNode.siblingId) {
		updates.push(
			db.treeNodes.update(newPrevNode.siblingId, { prevId: node.id })
		);
	}

	await Promise.all(updates);
};

/**
 * Insert a node into its new position in the tree
 * Determines whether to prepend as child or move after sibling
 */
const insertNodeIntoNewPosition = async (
	db: DemoDB,
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
		await prependChild(db, {
			bookId,
			node,
			newParentId,
			newPrevId
		});
	} else {
		await moveAfter(db, {
			bookId,
			node,
			newParentId,
			newPrevId
		});
	}
};

/**
 * Move a node to a new position in the tree structure
 * Main function that coordinates the entire move operation
 */
export const moveNode = async (
	db: DemoDB,
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
	const { shouldUpdateNode, node } = await checkShouldMoveNode(db, {
		nodeId,
		newParentId,
		newPrevId
	});

	if (!shouldUpdateNode || !node) {
		return;
	}

	await removeNodeFromOldPosition(db, node);
	await insertNodeIntoNewPosition(db, {
		bookId,
		node,
		newParentId,
		newPrevId
	});
};
