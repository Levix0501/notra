import { CatalogNodeVoWithLevel, CatalogNodeVo } from '@/types/catalog-node';

/**
 * Flatten catalog nodes
 * @param nodes - The catalog nodes to flatten
 * @returns The flattened catalog nodes
 */
export const flattenCatalogNodes = (
	nodes: CatalogNodeVo[]
): CatalogNodeVoWithLevel[] => {
	const result: CatalogNodeVoWithLevel[] = [];
	const nodeMap = new Map<number, CatalogNodeVoWithLevel>();
	let headNode: CatalogNodeVo | null = null;

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

	const processNode = (node: CatalogNodeVoWithLevel) => {
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
