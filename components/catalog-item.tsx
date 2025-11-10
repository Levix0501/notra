import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { BookEntity } from '@prisma/client';
import { ChevronRight, FileText, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { CSSProperties, useState } from 'react';
import { mutate } from 'swr';

import { updateDocMeta } from '@/actions/doc';
import { updateTitle } from '@/actions/tree-node';
import { Button } from '@/components/ui/button';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';
import { useGetBook } from '@/queries/book';
import { useDocStore } from '@/stores/doc';
import {
	useBookCatalogTree,
	mutateTree,
	BOOK_CATALOG_MAP
} from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { CatalogItemCreateDropdown } from './catalog-item-create-dropdown';
import { CatalogItemLevelIndicator } from './catalog-item-level-indicator';
import { CatalogItemMoreDropdown } from './catalog-item-more-dropdown';
import { CatalogItemWrapper } from './catalog-item-wrapper';
import { EditTitleForm } from './edit-title-form';

export interface CatalogItemProps {
	dragProvided: DraggableProvided;
	dragSnapshot: DraggableStateSnapshot;
	bookId: BookEntity['id'];
	item: TreeNodeVoWithLevel;
	style?: CSSProperties;
}

const t = getTranslations('components_catalog_item');

export const CatalogItem = ({
	dragProvided,
	dragSnapshot,
	bookId,
	item,
	style
}: CatalogItemProps) => {
	const [isEditingTitle, setIsEditingTitle] = useState(false);

	const { data: book } = useGetBook(bookId);
	const expandedKeys = useBookCatalogTree((state) => state.expandedKeys);
	const setExpandedKeys = useBookCatalogTree((state) => state.setExpandedKeys);
	const pathname = usePathname();

	const isActive = pathname === `/dashboard/${book?.id}/${item.docId}`;

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
		if (!book) {
			return;
		}

		if (title === item.title) {
			setIsEditingTitle(false);

			return;
		}

		if (title === '') {
			title = t.default_catalog_node_name;
		}

		const node = BOOK_CATALOG_MAP.get(item.id);

		if (!node) {
			return;
		}

		node.title = title;

		mutateTree(book.id, BOOK_CATALOG_MAP, async () => {
			const result = await updateTitle({
				id: item.id,
				title
			});

			if (!result.success || !result.data) {
				throw new Error(result.message);
			}

			return result.data;
		});

		if (item.docId !== null && item.docId === useDocStore.getState().id) {
			mutate(
				`/api/docs/${item.docId}/meta`,
				async () => {
					useDocStore.getState().setIsSaving(true);

					const result = await updateDocMeta({
						id: item.docId!,
						title
					});

					if (!result.success || !result.data) {
						useDocStore.getState().setIsSaving(false);

						throw new Error(result.message);
					}

					useDocStore.getState().setIsSaving(false);

					return result.data;
				},
				{
					optimisticData: (data) => ({
						...data,
						title
					})
				}
			);
		}

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
					'my-px flex h-8.5 items-center rounded-md border-[1.5px] border-transparent pr-1 text-sm hover:bg-sidebar-accent',
					Boolean(dragSnapshot.combineTargetFor) &&
						'border-[#117cee] dark:border-[#3b82ce]',
					isActive && 'bg-sidebar-accent font-bold'
				)}
				isEditingTitle={isEditingTitle}
				item={item}
				style={{ paddingLeft: 24 * item.level + 'px' }}
				onClick={handleClick}
			>
				<div className="relative mr-1 size-6">
					{item.type === 'GROUP' || item.childId !== null ? (
						<Button
							className="size-6 hover:bg-border"
							size="icon"
							variant="ghost"
							onClick={(e) => {
								e.preventDefault();
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
					) : (
						<div className={'flex size-6 items-center justify-center'}>
							<FileText size={16} />
						</div>
					)}

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

				<div
					className={cn(
						'opacity-100 md:opacity-0 md:group-hover/item:opacity-100',
						isEditingTitle && 'invisible'
					)}
				>
					<div className="flex items-center gap-px">
						<CatalogItemCreateDropdown
							bookId={bookId}
							parentTreeNodeId={item.id}
						>
							<Button
								className="size-6 hover:bg-border"
								size="icon"
								variant="ghost"
							>
								<Plus />
							</Button>
						</CatalogItemCreateDropdown>

						<CatalogItemMoreDropdown
							bookId={bookId}
							item={item}
							onRename={handleRename}
						/>
					</div>
				</div>
			</CatalogItemWrapper>

			<CatalogItemLevelIndicator nodeId={item.id} />
		</div>
	);
};
