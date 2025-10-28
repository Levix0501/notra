import { TreeNodeVoWithLevel, TreeNodeVo } from '@/types/tree-node';

/**
 * Flatten tree nodes
 * @param nodes - The tree nodes to flatten
 * @returns The flattened tree nodes
 */
export const flattenTreeNodeNodes = (
	nodes: TreeNodeVo[]
): TreeNodeVoWithLevel[] => {
	const result: TreeNodeVoWithLevel[] = [];
	const nodeMap = new Map<number, TreeNodeVoWithLevel>();
	let headNode: TreeNodeVo | null = null;

	nodes.forEach((node) => {
		const nodeWithLevel = { ...node, level: 0 };

		nodeMap.set(node.id, nodeWithLevel);

		if (!headNode && !nodeWithLevel.prevId && !nodeWithLevel.parentId) {
			headNode = nodeWithLevel;
		}
	});

	if (!headNode) {
		return result;
	}

	const processNode = (node: TreeNodeVoWithLevel) => {
		result.push(node);

		if (node.parentId) {
			const parentNode = nodeMap.get(node.parentId);

			if (parentNode) {
				node.level = parentNode.level + 1;
			}
		}

		if (node.childId) {
			const childNode = nodeMap.get(node.childId);

			if (childNode) {
				processNode(childNode);
			}
		}

		if (node.siblingId) {
			const siblingNode = nodeMap.get(node.siblingId);

			if (siblingNode) {
				processNode(siblingNode);
			}
		}
	};

	processNode(headNode);

	return result;
};
