'use client';

import {
	Draggable,
	DraggableProvided,
	DraggableRubric,
	DraggableStateSnapshot
} from '@hello-pangea/dnd';
import { BookEntity } from '@prisma/client';
import { AppWindowMac } from 'lucide-react';
import { CSSProperties, RefObject, useCallback, useRef } from 'react';
import { useResizeObserver } from 'usehooks-ts';

import { getTranslations } from '@/i18n';
import { useGetNavbarTreeNodes } from '@/queries/tree-node';
import { NAVBAR_MAP, useNavbarTree } from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { CloneNavItem } from './clone-nav-item';
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

const t = getTranslations('components_draggable_nav_items');

export function DraggableNavItems({
	bookId
}: Readonly<{ bookId: BookEntity['id'] }>) {
	const ref = useRef<HTMLDivElement>(null);

	const { height = 9999 } = useResizeObserver({
		ref: ref as RefObject<HTMLElement>
	});

	const expandedKeys = useNavbarTree((state) => state.expandedKeys);
	const reachLevelMap = useNavbarTree((state) => state.reachLevelMap);
	const setExpandedKeys = useNavbarTree((state) => state.setExpandedKeys);
	const setIsDragging = useNavbarTree((state) => state.setIsDragging);
	const setCurrentDropNode = useNavbarTree((state) => state.setCurrentDropNode);
	const setReachLevelRange = useNavbarTree((state) => state.setReachLevelRange);

	const { data, isLoading } = useGetNavbarTreeNodes(bookId);

	const isEmpty = !isLoading && !data?.length;
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
			<CloneNavItem
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
						<EmptyTitle>{t.no_nav_items}</EmptyTitle>
						<EmptyDescription>{t.no_nav_items_description}</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}

			{!isLoading && data && data.length > 0 && (
				<DragDropZone
					bookId={bookId}
					draggableList={draggableList}
					expandedKeys={expandedKeys}
					height={Math.min(height, (data ?? []).length * 36)}
					maxLevel={1}
					nodeMap={NAVBAR_MAP}
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
