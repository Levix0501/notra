import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { TreeNodeType } from '@prisma/client';
import { ChevronRight, ExternalLink, Link } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import { useNavbarTree } from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

export interface CloneNavItemProps {
	dragProvided: DraggableProvided;
	dragSnapshot: DraggableStateSnapshot;
	item: TreeNodeVoWithLevel;
}

export const CloneNavItem = ({
	dragProvided,
	dragSnapshot,
	item
}: CloneNavItemProps) => {
	const targetLevel = useRef(item.level);

	const setIsDragging = useNavbarTree((state) => state.setIsDragging);
	const setCurrentDropNodeReachLevel = useNavbarTree(
		(state) => state.setCurrentDropNodeReachLevel
	);

	useEffect(() => {
		if (
			dragProvided.draggableProps.style?.transform &&
			!dragSnapshot.isDropAnimating
		) {
			const pattern = /translate\(([^)]+)px,/;
			const match = RegExp(pattern).exec(
				dragProvided.draggableProps.style?.transform
			);

			if (match?.[1]) {
				const x = Number(match[1]);

				if (!Number.isNaN(x)) {
					targetLevel.current = setCurrentDropNodeReachLevel({
						x,
						initialLevel: item.level
					});
				}
			}
		}
	}, [
		dragProvided.draggableProps.style?.transform,
		dragSnapshot.isDropAnimating,
		item.level,
		setCurrentDropNodeReachLevel
	]);

	useEffect(() => {
		setIsDragging(!dragSnapshot.isDropAnimating);
	}, [dragSnapshot.isDropAnimating, setIsDragging]);

	const LinkIcon = item.isExternal ? ExternalLink : Link;

	return (
		<div
			{...dragProvided.draggableProps}
			{...dragProvided.dragHandleProps}
			className="px-4 md:px-2.5"
			style={{
				...dragProvided.draggableProps.style,
				cursor: 'pointer',
				...(dragSnapshot.isDropAnimating
					? {
							transform: `translate(${(targetLevel.current - item.level) * 24}px,${dragSnapshot.dropAnimation?.moveTo.y}px)`
						}
					: void 0)
			}}
		>
			<div
				className={cn(
					'my-px flex h-8.5 items-center rounded-md border-[1.5px] border-transparent pr-1 text-sm',
					dragSnapshot.isDragging &&
						'opacity-70 shadow-[0_1px_4px_-2px_rgba(0,0,0,.13),0_2px_8px_0_rgba(0,0,0,.08),0_8px_16px_4px_rgba(0,0,0,.04)]'
				)}
				style={{ paddingLeft: 24 * item.level + 'px' }}
			>
				<div className="mr-1 flex size-6 items-center justify-center">
					{item.type === TreeNodeType.GROUP || item.childId !== null ? (
						<ChevronRight size={16} />
					) : (
						<LinkIcon size={16} />
					)}
				</div>
				<div className="flex-1 truncate select-none">{item.title}</div>
			</div>
		</div>
	);
};
