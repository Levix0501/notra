'use client';

import {
	Draggable,
	DraggableStateSnapshot,
	DraggableProvided
} from '@hello-pangea/dnd';
import { BookEntity } from '@prisma/client';
import { Plus } from 'lucide-react';
import { CSSProperties, RefObject, useCallback, useRef } from 'react';
import { useResizeObserver } from 'usehooks-ts';

import { getTranslations } from '@/i18n';
import { useGetBook } from '@/queries/book';
import { useGetTreeNodes } from '@/queries/tree-node';
import { useTree, setNodeMap } from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { CatalogItem } from './catalog-item';
import { CreateDropdown } from './create-dropdown';
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

	const { isLoading: isBookLoading } = useGetBook(bookId);
	const { height = 9999 } = useResizeObserver({
		ref: ref as RefObject<HTMLElement>
	});
	const expandedKeys = useTree((state) => state.expandedKeys);
	const setExpandedKeys = useTree((state) => state.setExpandedKeys);
	const { data, isLoading: isCatalogNodesLoading } = useGetTreeNodes(bookId, {
		onSuccess(data) {
			setNodeMap(data);

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
				<CreateDropdown bookId={bookId} parentTreeNodeId={null}>
					<div className="h-9 px-4 md:px-2.5">
						<NotraSidebarButton className="px-1">
							<Plus size={16} /> <span>{t.new}</span>
						</NotraSidebarButton>
					</div>
				</CreateDropdown>
			)}

			{!isBookLoading && !isCatalogNodesLoading && data && data.length > 0 && (
				<DragDropZone
					bookId={bookId}
					draggableList={draggableList}
					height={height - 36}
					renderItem={renderItem}
				/>
			)}
		</div>
	);
}
