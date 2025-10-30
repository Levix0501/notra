import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { BookEntity, BookType } from '@prisma/client';
import { ChevronRight, ExternalLink, Link, Plus } from 'lucide-react';
import { CSSProperties, useState } from 'react';

import { updateTitle } from '@/actions/tree-node';
import { Button } from '@/components/ui/button';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';
import { useTree, nodeMap, mutateTree } from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { CatalogItemWrapper } from './catalog-item-wrapper';
import { EditTitleForm } from './edit-title-form';
import { LevelIndicator } from './level-indicator';
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

	const expandedKeys = useTree((state) => state.expandedKeys);
	const setExpandedKeys = useTree((state) => state.setExpandedKeys);

	const toggleExpandedKey = (key: number) => {
		if (expandedKeys.has(key)) {
			expandedKeys.delete(key);
		} else {
			expandedKeys.add(key);
		}

		setExpandedKeys(expandedKeys);
	};

	const handleClick = () => {
		if (item.type === 'GROUP') {
			toggleExpandedKey(item.id);
		} else if (item.type === 'DOC') {
			expandedKeys.add(item.id);
			setExpandedKeys(expandedKeys);
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

		const node = nodeMap.get(item.id);

		if (!node) {
			return;
		}

		node.title = title;

		mutateTree(bookId, async () => {
			const result = await updateTitle({
				id: item.id,
				title,
				bookType: BookType.NAVBAR
			});

			if (!result.success || !result.data) {
				throw new Error(result.message);
			}

			return result.data;
		});

		setIsEditingTitle(false);
	};

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
			<CatalogItemWrapper
				bookId={bookId}
				className={cn(
					'my-px flex h-[34px] items-center rounded-md border-[1.5px] border-transparent pr-1 text-sm hover:bg-sidebar-accent',
					Boolean(dragSnapshot.combineTargetFor) &&
						'border-[#117cee] dark:border-[#3b82ce]'
				)}
				isEditingTitle={isEditingTitle}
				item={item}
				style={{ paddingLeft: 24 * item.level + 'px' }}
				onClick={handleClick}
			>
				<div className="relative mr-1 size-6">
					<div className={'flex size-6 items-center justify-center'}>
						{item.type === 'GROUP' && (
							<ChevronRight
								className={cn(
									'absolute transition-transform duration-200',
									expandedKeys.has(item.id) && 'rotate-90'
								)}
								size={16}
							/>
						)}
						{item.type === 'LINK' && item.isExternal && (
							<ExternalLink size={16} />
						)}
						{item.type === 'LINK' && !item.isExternal && <Link size={16} />}
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
			</CatalogItemWrapper>

			<LevelIndicator nodeId={item.id} />
		</div>
	);
};
