import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { BookEntity, TreeNodeType } from '@prisma/client';
import { ChevronRight, ExternalLink, Link, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CSSProperties, useState } from 'react';

import { updateTreeNodeTitle } from '@/actions/tree-node';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app-context';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';
import { mutateTree, NAVBAR_MAP, useNavbarTree } from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { EditTitleForm } from './edit-title-form';
import { NavItemLevelIndicator } from './nav-item-level-indicator';
import { NavItemMoreDropdown } from './nav-item-more-dropdown';
import { useNavItemSheet } from './nav-item-sheet';

export interface NavItemProps {
	dragProvided: DraggableProvided;
	dragSnapshot: DraggableStateSnapshot;
	bookId: BookEntity['id'];
	item: TreeNodeVoWithLevel;
	style?: CSSProperties;
}

const t = getTranslations('components_nav_item');

export const NavItem = ({
	dragProvided,
	dragSnapshot,
	bookId,
	item,
	style
}: NavItemProps) => {
	const [isEditingTitle, setIsEditingTitle] = useState(false);

	const router = useRouter();

	const expandedKeys = useNavbarTree((state) => state.expandedKeys);
	const setExpandedKeys = useNavbarTree((state) => state.setExpandedKeys);
	const { isDemo } = useApp();

	const toggleExpandedKey = (key: number) => {
		if (expandedKeys.has(key)) {
			expandedKeys.delete(key);
		} else {
			expandedKeys.add(key);
		}

		setExpandedKeys(expandedKeys);
	};

	const handleClick = () => {
		if (item.type === TreeNodeType.GROUP) {
			toggleExpandedKey(item.id);
		} else if (item.type === TreeNodeType.LINK) {
			expandedKeys.add(item.id);
			setExpandedKeys(expandedKeys);

			if (item.isExternal) {
				window.open(item.url ?? '', '_blank');
			} else {
				router.push(item.url ?? '');
			}
		}
	};

	const handleRename = () => {
		setIsEditingTitle(true);
	};

	const handleSubmit = (title: string) => {
		if (title === item.title) {
			setIsEditingTitle(false);

			return;
		}

		if (title === '') {
			title = t.default_nav_item_name;
		}

		const node = NAVBAR_MAP.get(item.id);

		if (!node) {
			return;
		}

		node.title = title;

		mutateTree(bookId, NAVBAR_MAP, isDemo, async () => {
			const result = await updateTreeNodeTitle({
				id: item.id,
				title
			});

			if (!result.success || !result.data) {
				throw new Error(result.message);
			}

			return result.data;
		});

		setIsEditingTitle(false);
	};

	const LinkIcon = item.isExternal ? ExternalLink : Link;

	return (
		<div
			{...dragProvided.draggableProps}
			{...(isEditingTitle ? void 0 : dragProvided.dragHandleProps)}
			ref={dragProvided.innerRef}
			className="group/item px-4 md:px-2.5"
			style={{
				...style,
				...dragProvided.draggableProps.style,
				cursor: 'pointer'
			}}
		>
			<div
				key={isEditingTitle ? 'editing' : 'normal'}
				className={cn(
					'my-px flex h-8.5 items-center rounded-md border-[1.5px] border-transparent pr-1 text-sm hover:bg-sidebar-accent',
					Boolean(dragSnapshot.combineTargetFor) &&
						'border-[#117cee] dark:border-[#3b82ce]'
				)}
				role="button"
				style={{ paddingLeft: 24 * item.level + 'px' }}
				onClick={isEditingTitle ? void 0 : handleClick}
			>
				<div className="relative mr-1 size-6">
					<div className={'flex size-6 items-center justify-center'}>
						{item.type === TreeNodeType.LINK && (
							<LinkIcon
								className={cn(
									item.childId !== null && 'group-hover/item:hidden'
								)}
								size={16}
							/>
						)}

						{(item.type === TreeNodeType.GROUP || item.childId !== null) && (
							<Button
								className={cn(
									'size-6 hover:bg-border',
									item.type !== TreeNodeType.GROUP &&
										item.childId !== null &&
										'hidden group-hover/item:inline-flex'
								)}
								size="icon"
								variant="ghost"
								onClick={(e) => {
									e.stopPropagation();
									toggleExpandedKey(item.id);
								}}
							>
								<ChevronRight
									className={cn(
										'absolute transition-transform duration-200',
										expandedKeys.has(item.id) && 'rotate-90'
									)}
									size={16}
								/>
							</Button>
						)}
					</div>

					{!item.isPublished && (
						<div className="pointer-events-none absolute right-0.5 bottom-0.5 size-2 rounded-full bg-sidebar">
							<div className="absolute top-1/2 left-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EA580C]"></div>
						</div>
					)}
				</div>

				{isEditingTitle ? (
					<EditTitleForm
						key={item.id}
						defaultTitle={item.title}
						onSubmit={handleSubmit}
					/>
				) : (
					<div className="flex-1 truncate select-none">{item.title}</div>
				)}

				<div className={cn(isEditingTitle && 'invisible')}>
					<div className="flex items-center gap-px">
						{item.level === 0 && (
							<Button
								className="size-6 hover:bg-border"
								size="icon"
								variant="ghost"
								onClick={(e) => {
									e.stopPropagation();
									useNavItemSheet.setState({
										open: true,
										parentTreeNodeId: item.id,
										id: null
									});
								}}
							>
								<Plus />
							</Button>
						)}

						<NavItemMoreDropdown
							bookId={bookId}
							item={item}
							onRename={handleRename}
						/>
					</div>
				</div>
			</div>

			<NavItemLevelIndicator nodeId={item.id} />
		</div>
	);
};
