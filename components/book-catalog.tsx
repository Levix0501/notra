'use client';

import {
	Draggable,
	DraggableStateSnapshot,
	DraggableProvided,
	DraggableRubric
} from '@hello-pangea/dnd';
import { BookEntity } from '@prisma/client';
import { Plus } from 'lucide-react';
import { CSSProperties, RefObject, useCallback, useRef } from 'react';
import { useResizeObserver } from 'usehooks-ts';

import { getTranslations } from '@/i18n';
import { useGetBook } from '@/queries/book';
import { useGetTreeNodes } from '@/queries/tree-node';
import {
	BOOK_CATALOG_MAP,
	setTreeNodeMap,
	useBookCatalogTree
} from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { CatalogItem } from './catalog-item';
import { CatalogItemCreateDropdown } from './catalog-item-create-dropdown';
import { CloneCatalogItem } from './clone-catalog-item';
import { DragDropZone } from './drag-drop-zone';
import { NotraSidebarButton } from './notra-sidebar';
import { NotraSkeleton } from './notra-skeleton';

export interface BookCatalogProps {
	bookId: BookEntity['id'];
}

const t = getTranslations('components_book_catalog');

export function BookCatalog({ bookId }: Readonly<BookCatalogProps>) {
	const ref = useRef<HTMLDivElement>(null);
	const hasDefaultExpandedKeysGenerated = useRef(false);

	const { height = 9999 } = useResizeObserver({
		ref: ref as RefObject<HTMLElement>
	});

	const expandedKeys = useBookCatalogTree((state) => state.expandedKeys);
	const reachLevelMap = useBookCatalogTree((state) => state.reachLevelMap);
	const setExpandedKeys = useBookCatalogTree((state) => state.setExpandedKeys);
	const setIsDragging = useBookCatalogTree((state) => state.setIsDragging);
	const setCurrentDropNode = useBookCatalogTree(
		(state) => state.setCurrentDropNode
	);
	const setReachLevelRange = useBookCatalogTree(
		(state) => state.setReachLevelRange
	);

	const { isLoading: isBookLoading } = useGetBook(bookId);
	const { data, isLoading: isCatalogNodesLoading } = useGetTreeNodes(bookId, {
		onSuccess(data) {
			setTreeNodeMap(BOOK_CATALOG_MAP, data);

			if (data && !hasDefaultExpandedKeysGenerated.current) {
				hasDefaultExpandedKeysGenerated.current = true;
				const defaultExpandedKeys = data
					.filter((node) => node.level === 0)
					.map((node) => node.id);

				setExpandedKeys(defaultExpandedKeys);
			}
		}
	});

	const draggableList = (data ?? []).filter(
		(node) =>
			node.level === 0 || (node.parentId && expandedKeys.has(node.parentId))
	);

	const renderCloneItem = useCallback(
		(
			dragProvided: DraggableProvided,
			dragSnapshot: DraggableStateSnapshot,
			rubric: DraggableRubric
		) => (
			<CloneCatalogItem
				dragProvided={dragProvided}
				dragSnapshot={dragSnapshot}
				item={draggableList[rubric.source.index]}
			/>
		),
		[draggableList]
	);

	const renderItem = useCallback(
		(props: {
			data: TreeNodeVoWithLevel[];
			index: number;
			style: CSSProperties;
		}) => {
			const { data, index, style } = props;
			const item = data[index];

			return (
				<Draggable key={item.id} draggableId={item.id.toString()} index={index}>
					{(
						dragProvided: DraggableProvided,
						dragSnapshot: DraggableStateSnapshot
					) => (
						<CatalogItem
							bookId={bookId}
							dragProvided={dragProvided}
							dragSnapshot={dragSnapshot}
							item={item}
							style={style}
						/>
					)}
				</Draggable>
			);
		},
		[bookId]
	);

	return (
		<div className="relative size-full">
			<div ref={ref} className="absolute h-full w-px"></div>

			{(isBookLoading || isCatalogNodesLoading) && (
				<div className="px-4 md:px-2.5">
					<NotraSkeleton />
				</div>
			)}

			{!isBookLoading && !isCatalogNodesLoading && (
				<CatalogItemCreateDropdown bookId={bookId} parentTreeNodeId={null}>
					<div className="h-9 px-4 md:px-2.5">
						<NotraSidebarButton className="px-1">
							<Plus size={16} /> <span>{t.new}</span>
						</NotraSidebarButton>
					</div>
				</CatalogItemCreateDropdown>
			)}

			{!isBookLoading && !isCatalogNodesLoading && data && data.length > 0 && (
				<DragDropZone
					bookId={bookId}
					draggableList={draggableList}
					expandedKeys={expandedKeys}
					height={height - 36}
					nodeMap={BOOK_CATALOG_MAP}
					reachLevelMap={reachLevelMap}
					renderCloneItem={renderCloneItem}
					renderItem={renderItem}
					setCurrentDropNode={setCurrentDropNode}
					setExpandedKeys={setExpandedKeys}
					setIsDragging={setIsDragging}
					setReachLevelRange={setReachLevelRange}
				/>
			)}
		</div>
	);
}
