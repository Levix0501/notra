'use client';

import {
	Draggable,
	DraggableProvided,
	DraggableStateSnapshot
} from '@hello-pangea/dnd';
import { BookEntity } from '@prisma/client';
import { AppWindowMac } from 'lucide-react';
import { CSSProperties, RefObject, useCallback, useRef } from 'react';
import { useResizeObserver } from 'usehooks-ts';

import { getTranslations } from '@/i18n';
import { useGetTreeNodes } from '@/queries/tree-node';
import { setNodeMap, useTree } from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { DragDropZone } from './drag-drop-zone';
import { NavItem } from './nav-item';
import { NotraSkeleton } from './notra-skeleton';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from './ui/empty';

const t = getTranslations('components_navbar');

export function Navbar({ bookId }: Readonly<{ bookId: BookEntity['id'] }>) {
	const ref = useRef<HTMLDivElement>(null);
	const hasDefaultExpandedKeysGenerated = useRef(false);

	const { height = 9999 } = useResizeObserver({
		ref: ref as RefObject<HTMLElement>
	});

	const expandedKeys = useTree((state) => state.expandedKeys);
	const setExpandedKeys = useTree((state) => state.setExpandedKeys);
	const { data, isLoading: isNavbarTreeNodesLoading } = useGetTreeNodes(
		bookId,
		{
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
		}
	);
	const isLoading = isNavbarTreeNodesLoading;
	const isEmpty = !isLoading && !data?.length;

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
						<NavItem
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

			{isLoading && (
				<div className="px-4 md:px-2.5">
					<NotraSkeleton />
				</div>
			)}

			{isEmpty && (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<AppWindowMac />
						</EmptyMedia>
						<EmptyTitle>{t.no_navbar_items}</EmptyTitle>
						<EmptyDescription>{t.no_navbar_items_description}</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}

			{!isLoading && data && data.length > 0 && (
				<DragDropZone
					bookId={bookId}
					draggableList={draggableList}
					height={Math.min(height, (data ?? []).length * 36)}
					maxLevel={1}
					renderItem={renderItem}
				/>
			)}
		</div>
	);
}
