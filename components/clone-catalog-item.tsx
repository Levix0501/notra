import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CatalogNodeVoWithLevel } from '@/types/catalog-node';

export interface CatalogItemProps {
	dragProvided: DraggableProvided;
	dragSnapshot: DraggableStateSnapshot;
	item: CatalogNodeVoWithLevel;
}

const CloneCatalogItem = ({
	dragProvided,
	dragSnapshot,
	item
}: CatalogItemProps) => {
	return (
		<div
			{...dragProvided.draggableProps}
			{...dragProvided.dragHandleProps}
			className="px-2"
			style={{
				...dragProvided.draggableProps.style,
				cursor: 'pointer'
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
				{item.title}
			</div>
		</div>
	);
};

export default CloneCatalogItem;
