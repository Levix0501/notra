'use client';

import {
	Draggable,
	DraggableProvided,
	DraggableRubric,
	DraggableStateSnapshot
} from '@hello-pangea/dnd';
import { BookEntity } from '@prisma/client';
import { Contact } from 'lucide-react';
import { CSSProperties, RefObject, useCallback, useRef } from 'react';
import { useResizeObserver } from 'usehooks-ts';

import { getTranslations } from '@/i18n';
import { useGetContactInfoTreeNodes } from '@/queries/tree-node';
import { CONTACT_INFO_MAP, useContactInfoTree } from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { CloneContactInfoItem } from './clone-contact-info-item';
import { ContactInfoItem } from './contact-info-item';
import { DragDropZone } from './drag-drop-zone';
import { NotraSkeleton } from './notra-skeleton';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from './ui/empty';

const t = getTranslations('components_draggable_contact_info_items');

export function DraggableContactInfoItems({
	bookId
}: Readonly<{ bookId: BookEntity['id'] }>) {
	const ref = useRef<HTMLDivElement>(null);

	const { height = 9999 } = useResizeObserver({
		ref: ref as RefObject<HTMLElement>
	});

	const expandedKeys = useContactInfoTree((state) => state.expandedKeys);
	const reachLevelMap = useContactInfoTree((state) => state.reachLevelMap);
	const setExpandedKeys = useContactInfoTree((state) => state.setExpandedKeys);
	const setIsDragging = useContactInfoTree((state) => state.setIsDragging);
	const setCurrentDropNode = useContactInfoTree(
		(state) => state.setCurrentDropNode
	);
	const setReachLevelRange = useContactInfoTree(
		(state) => state.setReachLevelRange
	);

	const { data, isLoading } = useGetContactInfoTreeNodes(bookId);

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
			<CloneContactInfoItem
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
						<ContactInfoItem
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
							<Contact />
						</EmptyMedia>
						<EmptyTitle>{t.no_contact_info}</EmptyTitle>
						<EmptyDescription>{t.no_contact_info_description}</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}

			{!isLoading && data && data.length > 0 && (
				<DragDropZone
					bookId={bookId}
					draggableList={draggableList}
					expandedKeys={expandedKeys}
					height={Math.min(height, (data ?? []).length * 36)}
					maxLevel={0}
					nodeMap={CONTACT_INFO_MAP}
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
