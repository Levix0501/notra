import {
	DragDropContext,
	Draggable,
	DraggableProvided,
	DraggableRubric,
	DraggableStateSnapshot,
	DragStart,
	DragUpdate,
	Droppable,
	DroppableProvided,
	DropResult
} from '@hello-pangea/dnd';
import { CatalogNodeEntity } from '@prisma/client';
import { useRef } from 'react';
import { FixedSizeList } from 'react-window';

import {
	prependChild as prependChildAction,
	moveAfter as moveAfterAction
} from '@/actions/catalog-node';
import { checkShouldMoveNode, moveNode } from '@/lib/catalog/client';
import useCatalog, { mutateCatalog, nodeMap } from '@/stores/catalog';
import { CatalogNodeView, CatalogNodeVoWithLevel } from '@/types/catalog-node';

import CatalogItem from './catalog-item';
import CloneCatalogItem from './clone-catalog-item';

interface DragDropZoneProps {
	bookId: CatalogNodeEntity['bookId'];
	draggableList: CatalogNodeVoWithLevel[];
	height: number;
}

export default function DragDropZone({
	bookId,
	draggableList,
	height
}: Readonly<DragDropZoneProps>) {
	const expandedKeysBeforeDrag = useRef<Set<number>>(new Set());

	const expandedKeys = useCatalog((state) => state.expandedKeys);
	const reachLevelMap = useCatalog((state) => state.reachLevelMap);
	const setExpandedKeys = useCatalog((state) => state.setExpandedKeys);
	const setIsDragging = useCatalog((state) => state.setIsDragging);
	const setCurrentDropNode = useCatalog((state) => state.setCurrentDropNode);
	const setReachLevelRange = useCatalog((state) => state.setReachLevelRange);

	const updateDropNode = ({
		dropNode,
		nodeAfterDropNode
	}: {
		dropNode?: CatalogNodeView | null;
		nodeAfterDropNode?: CatalogNodeView;
	}) => {
		if (!dropNode) {
			setCurrentDropNode(null);

			return;
		}

		const reachLevelRange: [number, number] = [
			dropNode.minReachLevel,
			dropNode.childId === null || expandedKeys.has(dropNode.id)
				? dropNode.maxReachLevel
				: dropNode.maxReachLevel - 1
		];

		if (nodeAfterDropNode) {
			reachLevelRange[0] = Math.max(
				reachLevelRange[0],
				nodeAfterDropNode.level
			);
		}

		setCurrentDropNode(dropNode);
		setReachLevelRange(dropNode.id, reachLevelRange);
	};

	const prependChild = ({
		nodeId,
		newParentId
	}: {
		nodeId: CatalogNodeEntity['id'];
		newParentId: CatalogNodeEntity['parentId'];
	}) => {
		const newPrevId = newParentId;

		const { shouldUpdateNode, node } = checkShouldMoveNode(nodeMap, {
			nodeId,
			newParentId,
			newPrevId
		});

		if (!shouldUpdateNode || !node) {
			return;
		}

		moveNode(nodeMap, {
			node,
			newParentId,
			newPrevId
		});

		if (newParentId) {
			expandedKeysBeforeDrag.current.add(newParentId);
		}

		mutateCatalog(bookId, async () => {
			const result = await prependChildAction({
				bookId,
				nodeId,
				targetId: newParentId
			});

			if (!result.success || !result.data) {
				throw new Error(result.message);
			}

			return result.data;
		});
	};

	const moveAfter = ({
		nodeId,
		newPrevId
	}: {
		nodeId: CatalogNodeEntity['id'];
		newPrevId: CatalogNodeEntity['id'];
	}) => {
		const newPrevNode = nodeMap.get(newPrevId);

		if (!newPrevNode) {
			return;
		}

		const { shouldUpdateNode, node } = checkShouldMoveNode(nodeMap, {
			nodeId,
			newParentId: newPrevNode.parentId,
			newPrevId
		});

		if (!shouldUpdateNode || !node) {
			return;
		}

		moveNode(nodeMap, {
			node,
			newParentId: newPrevNode.parentId,
			newPrevId
		});

		mutateCatalog(bookId, async () => {
			const result = await moveAfterAction({
				bookId,
				nodeId,
				targetId: newPrevId
			});

			if (!result.success || !result.data) {
				throw new Error(result.message);
			}

			return result.data;
		});
	};

	const handleBeforeCapture = () => {
		setIsDragging(true);
	};

	const handleBeforeDragStart = (start: DragStart) => {
		const dragNode = nodeMap.get(Number(start.draggableId));

		if (!dragNode) {
			return;
		}

		expandedKeysBeforeDrag.current = new Set(expandedKeys);

		const deleteKey = (key: number | null) => {
			if (!key) {
				return;
			}

			expandedKeys.delete(key);

			const node = nodeMap.get(key);

			if (!node) {
				return;
			}

			if (node.childId) {
				deleteKey(node.childId);
			}

			if (node.siblingId) {
				deleteKey(node.siblingId);
			}
		};

		expandedKeys.delete(dragNode.id);
		deleteKey(dragNode.childId);

		setExpandedKeys(expandedKeys);
	};

	const handleDragStart = (start: DragStart) => {
		if (start.source.index > 0) {
			updateDropNode({
				dropNode: nodeMap.get(draggableList[start.source.index - 1].id),
				nodeAfterDropNode:
					start.source.index < draggableList.length - 1
						? nodeMap.get(draggableList[start.source.index + 1].id)
						: void 0
			});
		}
	};

	const handleDragUpdate = (update: DragUpdate) => {
		if (update.destination?.index === 0 || update.combine) {
			setCurrentDropNode(null);

			return;
		}

		if (update.destination && update.destination.index > 0) {
			let nodeAfterDropNode: CatalogNodeView | undefined = void 0;

			if (update.destination.index < draggableList.length - 1) {
				const index =
					update.destination.index <= update.source.index
						? update.destination.index
						: update.destination.index + 1;

				nodeAfterDropNode = nodeMap.get(draggableList[index].id);
			}

			updateDropNode({
				dropNode: nodeMap.get(
					draggableList[
						update.destination.index <= update.source.index
							? update.destination.index - 1
							: update.destination.index
					].id
				),
				nodeAfterDropNode
			});
		}
	};

	const handleDragEnd = (result: DropResult) => {
		const nodeId = Number(result.draggableId);

		if (result.combine) {
			const newParentId = Number(result.combine.draggableId);

			prependChild({ nodeId, newParentId });
			setExpandedKeys(expandedKeysBeforeDrag.current);

			return;
		}

		if (!result.destination) {
			return;
		}

		if (result.destination.index === 0) {
			prependChild({ nodeId, newParentId: null });
			setExpandedKeys(expandedKeysBeforeDrag.current);

			return;
		}

		const dropNodeId =
			draggableList[
				result.destination.index <= result.source.index
					? result.destination.index - 1
					: result.destination.index
			].id;

		const dropNodeLevel = nodeMap.get(dropNodeId)?.level;
		const dropNodeReachLevel = reachLevelMap.get(dropNodeId);

		if (dropNodeLevel === void 0 || dropNodeReachLevel === void 0) {
			return;
		}

		if (dropNodeLevel < dropNodeReachLevel) {
			prependChild({ nodeId, newParentId: dropNodeId });
		} else if (dropNodeLevel === dropNodeReachLevel) {
			moveAfter({ nodeId, newPrevId: dropNodeId });
		} else {
			let diff = dropNodeLevel - dropNodeReachLevel;
			let tempNodeId = dropNodeId;

			while (diff > 0) {
				diff--;

				const parentId = nodeMap.get(tempNodeId)?.parentId;

				if (!parentId) {
					return;
				}

				tempNodeId = parentId;
			}

			moveAfter({ nodeId, newPrevId: tempNodeId });
		}

		setExpandedKeys(expandedKeysBeforeDrag.current);
	};

	return (
		<DragDropContext
			onBeforeCapture={handleBeforeCapture}
			onBeforeDragStart={handleBeforeDragStart}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			onDragUpdate={handleDragUpdate}
		>
			<Droppable
				isCombineEnabled
				droppableId="Catalog"
				mode="virtual"
				renderClone={(
					dragProvided: DraggableProvided,
					dragSnapshot: DraggableStateSnapshot,
					rubric: DraggableRubric
				) => (
					<CloneCatalogItem
						dragProvided={dragProvided}
						dragSnapshot={dragSnapshot}
						item={draggableList[rubric.source.index]}
					/>
				)}
			>
				{(dropProvided: DroppableProvided) => (
					<FixedSizeList
						className="px-4 md:px-2.5"
						height={height}
						itemCount={draggableList.length}
						itemData={draggableList}
						itemSize={36}
						outerRef={dropProvided.innerRef}
						width="100%"
					>
						{({ data, index, style }) => {
							const item = data[index];

							return (
								<Draggable
									key={item.id}
									draggableId={item.id.toString()}
									index={index}
								>
									{(
										dragProvided: DraggableProvided,
										dragSnapshot: DraggableStateSnapshot
									) => (
										<CatalogItem
											dragProvided={dragProvided}
											dragSnapshot={dragSnapshot}
											item={item}
											style={style}
										/>
									)}
								</Draggable>
							);
						}}
					</FixedSizeList>
				)}
			</Droppable>
		</DragDropContext>
	);
}
