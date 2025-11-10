import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { useEffect, useRef } from 'react';

import { CONTACT_INFO_ICONS } from '@/constants/contact';
import { cn } from '@/lib/utils';
import { useGetSiteSettings } from '@/queries/site-settings';
import { useContactInfoTree } from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { ContactInfoIcon } from './contact-info-icon';

export interface ContactInfoItemProps {
	dragProvided: DraggableProvided;
	dragSnapshot: DraggableStateSnapshot;
	item: TreeNodeVoWithLevel;
}

export const CloneContactInfoItem = ({
	dragProvided,
	dragSnapshot,
	item
}: ContactInfoItemProps) => {
	const targetLevel = useRef(item.level);

	const { data: siteSettings } = useGetSiteSettings();

	const setIsDragging = useContactInfoTree((state) => state.setIsDragging);
	const setCurrentDropNodeReachLevel = useContactInfoTree(
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

	const icon = CONTACT_INFO_ICONS.find((icon) => icon.slug === item.icon);

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
					'my-px flex h-8.5 items-center rounded-md border-[1.5px] border-transparent px-1 text-sm',
					dragSnapshot.isDragging &&
						'opacity-70 shadow-[0_1px_4px_-2px_rgba(0,0,0,.13),0_2px_8px_0_rgba(0,0,0,.08),0_8px_16px_4px_rgba(0,0,0,.04)]'
				)}
			>
				<div className="relative mr-1 size-6">
					<div className="flex size-6 items-center justify-center">
						<ContactInfoIcon
							colored={siteSettings?.coloredContactIcons ?? false}
							hex={icon?.hex ?? ''}
							svg={icon?.svg ?? ''}
						/>
					</div>

					{!item.isPublished && (
						<div className="pointer-events-none absolute right-0.5 bottom-0.5 size-2 rounded-full bg-sidebar">
							<div className="absolute top-1/2 left-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EA580C]"></div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
