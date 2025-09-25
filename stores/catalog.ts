import { BookEntity, CatalogNodeEntity } from '@prisma/client';
import { mutate } from 'swr';
import { create } from 'zustand';

import { flattenCatalogNodes } from '@/lib/catalog/shared';
import { CatalogNodeVoWithLevel, CatalogNodeView } from '@/types/catalog-node';

export const nodeMap = new Map<CatalogNodeEntity['id'], CatalogNodeView>();

export const setNodeMap = (data: CatalogNodeVoWithLevel[]) => {
	nodeMap.clear();

	for (const node of data) {
		const minReachLevel = node.parentId
			? nodeMap.get(node.parentId)!.minReachLevel
			: node.level;
		const maxReachLevel = node.childId ? node.level + 1 : node.level;

		nodeMap.set(node.id, {
			...node,
			minReachLevel,
			maxReachLevel
		});
	}
};

export const mutateCatalog = (
	bookId: BookEntity['id'],
	mutateFn?: () => Promise<CatalogNodeVoWithLevel[]>
) => {
	const optimisticData = flattenCatalogNodes(Array.from(nodeMap.values()));

	setNodeMap(optimisticData);
	mutate(`/api/catalog-nodes/${bookId}`, mutateFn || ((state) => state), {
		optimisticData,
		revalidate: !mutateFn
	});
};

type CatalogStore = {
	expandedKeys: Set<CatalogNodeEntity['id']>;
	isDragging: boolean;
	currentDropNode: CatalogNodeView | null;
	reachLevelMap: Map<CatalogNodeEntity['id'], number>;
	reachLevelRangeMap: Map<CatalogNodeEntity['id'], [number, number]>;
	setExpandedKeys: (
		expandedKeys: Set<CatalogNodeEntity['id']> | CatalogNodeEntity['id'][]
	) => void;
	setIsDragging: (isDragging: boolean) => void;
	setCurrentDropNode: (currentDropNode: CatalogNodeView | null) => void;
	setReachLevel: (nodeId: CatalogNodeEntity['id'], reachLevel: number) => void;
	setReachLevelRange: (
		nodeId: CatalogNodeEntity['id'],
		reachLevelRange: [number, number]
	) => void;
	setCurrentDropNodeReachLevel: (params: {
		x: number;
		initialLevel: number;
	}) => number;
};

const useCatalog = create<CatalogStore>((set, get) => ({
	expandedKeys: new Set(),
	isDragging: false,
	currentDropNode: null,
	reachLevelMap: new Map(),
	reachLevelRangeMap: new Map(),
	setExpandedKeys: (expandedKeys) =>
		set({ expandedKeys: new Set(expandedKeys) }),
	setIsDragging: (isDragging) => set({ isDragging }),
	setCurrentDropNode: (currentDropNode) => set({ currentDropNode }),
	setReachLevel: (nodeId, reachLevel) =>
		set((state) => {
			state.reachLevelMap.set(nodeId, reachLevel);

			return {};
		}),
	setReachLevelRange: (nodeId, reachLevelRange) =>
		set((state) => {
			state.reachLevelRangeMap.set(nodeId, reachLevelRange);

			return {};
		}),
	setCurrentDropNodeReachLevel: ({ x, initialLevel }) => {
		const state = get();

		const currentDropNode = state.currentDropNode;

		if (!currentDropNode) {
			return initialLevel;
		}

		const reachLevelRange = state.reachLevelRangeMap.get(currentDropNode.id);

		if (!reachLevelRange) {
			return initialLevel;
		}

		let reachLevel = Math.round(x / 24) + initialLevel;

		reachLevel = Math.max(reachLevel, reachLevelRange[0]);
		reachLevel = Math.min(reachLevel, reachLevelRange[1]);
		state.reachLevelMap.set(currentDropNode.id, reachLevel);
		set({});

		return reachLevel;
	}
}));

export default useCatalog;
