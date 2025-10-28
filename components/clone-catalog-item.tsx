import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import { useTree } from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

export interface CatalogItemProps {
	dragProvided: DraggableProvided;
	dragSnapshot: DraggableStateSnapshot;
	item: TreeNodeVoWithLevel;
}

export const CloneCatalogItem = ({
	dragProvided,
	dragSnapshot,
	item
}: CatalogItemProps) => {
	const targetLevel = useRef(item.level);

	const setIsDragging = useTree((state) => state.setIsDragging);
	const setCurrentDropNodeReachLevel = useTree(
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

	return (
		<div
			{...dragProvided.draggableProps}
			{...dragProvided.dragHandleProps}
			className="px-2"
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
					'flex h-full items-center rounded-md border-[6px] border-transparent text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
					dragSnapshot.isDragging &&
						'opacity-70 shadow-[0_1px_4px_-2px_rgba(0,0,0,.13),0_2px_8px_0_rgba(0,0,0,.08),0_8px_16px_4px_rgba(0,0,0,.04)]'
				)}
				style={{ paddingLeft: 24 * item.level + 'px' }}
			>
				<div className="mr-1 size-6">
					{item.childId !== null && (
						<div className="flex h-full w-full items-center justify-center rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
							<ChevronRight
								className="transition-transform duration-200"
								size={16}
							/>
						</div>
					)}
				</div>
				<div className="flex-1 truncate select-none">{item.title}</div>
			</div>
		</div>
	);
};
