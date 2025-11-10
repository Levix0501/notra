import { BookEntity, TreeNodeEntity } from '@prisma/client';
import { mutate } from 'swr';
import { create } from 'zustand';

import { flattenTreeNodeNodes } from '@/lib/tree/shared';
import { TreeNodeVoWithLevel, TreeNodeView } from '@/types/tree-node';

export type TreeNodeMap = Map<TreeNodeEntity['id'], TreeNodeView>;

export const BOOK_CATALOG_MAP: TreeNodeMap = new Map();
export const NAVBAR_MAP: TreeNodeMap = new Map();
export const CONTACT_INFO_MAP: TreeNodeMap = new Map();

export const setTreeNodeMap = (
	nodeMap: TreeNodeMap,
	data: TreeNodeVoWithLevel[]
) => {
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

export const mutateTree = (
	bookId: BookEntity['id'],
	nodeMap: TreeNodeMap,
	mutateFn?: () => Promise<TreeNodeVoWithLevel[]>
) => {
	const optimisticData = flattenTreeNodeNodes(Array.from(nodeMap.values()));

	setTreeNodeMap(nodeMap, optimisticData);
	mutate(`/api/tree-nodes/${bookId}`, mutateFn || ((state) => state), {
		optimisticData,
		revalidate: !mutateFn
	});
};

export type TreeStore = {
	expandedKeys: Set<TreeNodeEntity['id']>;
	isDragging: boolean;
	currentDropNode: TreeNodeView | null;
	reachLevelMap: Map<TreeNodeEntity['id'], number>;
	reachLevelRangeMap: Map<TreeNodeEntity['id'], [number, number]>;
	setExpandedKeys: (
		expandedKeys: Set<TreeNodeEntity['id']> | TreeNodeEntity['id'][]
	) => void;
	setIsDragging: (isDragging: boolean) => void;
	setCurrentDropNode: (currentDropNode: TreeNodeView | null) => void;
	setReachLevel: (nodeId: TreeNodeEntity['id'], reachLevel: number) => void;
	setReachLevelRange: (
		nodeId: TreeNodeEntity['id'],
		reachLevelRange: [number, number]
	) => void;
	setCurrentDropNodeReachLevel: (params: {
		x: number;
		initialLevel: number;
	}) => number;
};

const createTreeStore = () =>
	create<TreeStore>((set, get) => ({
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

export const useBookCatalogTree = createTreeStore();

export const useNavbarTree = createTreeStore();

export const useContactInfoTree = createTreeStore();
