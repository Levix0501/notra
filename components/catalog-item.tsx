import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import {
	ChevronRight,
	MoreVertical,
	Plus,
	SlidersHorizontal,
	TextCursorInput,
	Trash2
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { CSSProperties, useState } from 'react';
import { toast } from 'sonner';
import { mutate } from 'swr';

import { deleteWithChildren, updateTitle } from '@/actions/catalog-node';
import { updateDocMeta } from '@/actions/doc';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';
import { deleteNodeWithChildren } from '@/lib/catalog/client';
import { cn } from '@/lib/utils';
import { useCurrentBook } from '@/stores/book';
import useCatalog, { mutateCatalog, nodeMap } from '@/stores/catalog';
import { useDocStore } from '@/stores/doc';
import { CatalogNodeVoWithLevel } from '@/types/catalog-node';

import { useBookSettingsDialog } from './book-settings-dialog';
import CatalogItemWrapper from './catalog-item-wrapper';
import CreateDropdown from './create-dropdown';
import EditTitleForm from './edit-title-form';
import LevelIndicator from './level-indicator';

export interface CatalogItemProps {
	dragProvided: DraggableProvided;
	dragSnapshot: DraggableStateSnapshot;
	item: CatalogNodeVoWithLevel;
	style?: CSSProperties;
}

const t = getTranslations('components_catalog_item');

const CatalogItem = ({
	dragProvided,
	dragSnapshot,
	item,
	style
}: CatalogItemProps) => {
	const [isEditingTitle, setIsEditingTitle] = useState(false);

	const { data: book } = useCurrentBook();
	const expandedKeys = useCatalog((state) => state.expandedKeys);
	const setExpandedKeys = useCatalog((state) => state.setExpandedKeys);
	const pathname = usePathname();

	if (!book) {
		return null;
	}

	const isActive = pathname === `/dashboard/${book.slug}/${item.url}`;

	const toggleExpandedKey = (key: number) => {
		if (expandedKeys.has(key)) {
			expandedKeys.delete(key);
		} else {
			expandedKeys.add(key);
		}

		setExpandedKeys(expandedKeys);
	};

	const handleClick = () => {
		if (item.type === 'STACK') {
			toggleExpandedKey(item.id);
		} else if (item.type === 'DOC') {
			expandedKeys.add(item.id);
			setExpandedKeys(expandedKeys);
		}
	};

	const handleRename = () => {
		setIsEditingTitle(true);
	};

	const handleSettings = () => {
		if (item.type === 'DOC' && item.url) {
			useBookSettingsDialog.setState({
				tab: 'doc',
				docSlug: item.url,
				open: true
			});
		}
	};

	const handleDelete = () => {
		deleteNodeWithChildren(nodeMap, item.id);
		mutateCatalog(book.id, async () => {
			const promise = (async () => {
				const result = await deleteWithChildren({
					nodeId: item.id,
					bookId: book.id
				});

				if (!result.success || !result.data) {
					throw new Error(result.message);
				}

				return result.data;
			})();

			return await toast
				.promise(promise, {
					loading: t.delete_loading,
					success: t.delete_success,
					error: t.delete_error
				})
				.unwrap();
		});
	};

	const handleSubmit = (title: string) => {
		if (title === item.title) {
			setIsEditingTitle(false);

			return;
		}

		if (title === '') {
			title = t.default_catalog_node_name;
		}

		const node = nodeMap.get(item.id);

		if (!node) {
			return;
		}

		node.title = title;

		mutateCatalog(book.id, async () => {
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
				`/api/docs/meta?book_slug=${book.slug}&doc_slug=${item.url}`,
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
				className={cn(
					'my-px flex h-[34px] items-center rounded-md border-[1.5px] border-transparent pr-1.5 text-sm hover:bg-sidebar-accent',
					Boolean(dragSnapshot.combineTargetFor) &&
						'border-[#117cee] dark:border-[#3b82ce]',
					isActive && 'bg-sidebar-accent font-bold'
				)}
				isEditingTitle={isEditingTitle}
				item={item}
				style={{ paddingLeft: 24 * item.level + 'px' }}
				onClick={handleClick}
			>
				<div className="mr-1 size-6">
					{item.childId !== null && (
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
									'transition-transform duration-200',
									expandedKeys.has(item.id) && 'rotate-90'
								)}
								size={16}
							/>
						</Button>
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
					<div className="flex items-center gap-x-2">
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger
								asChild
								onClick={(e) => {
									e.stopPropagation();
									e.preventDefault();
								}}
							>
								<Button
									className="size-6 hover:bg-border"
									size="icon"
									variant="ghost"
								>
									<MoreVertical />
									<span className="sr-only">More</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								onClick={(e) => e.stopPropagation()}
							>
								<DropdownMenuItem onClick={handleRename}>
									<TextCursorInput className="text-popover-foreground" />
									{t.rename}
								</DropdownMenuItem>

								{item.type === 'DOC' && (
									<DropdownMenuItem onClick={handleSettings}>
										<SlidersHorizontal className="text-popover-foreground" />
										{t.settings}
									</DropdownMenuItem>
								)}

								<DropdownMenuSeparator />

								<DropdownMenuItem variant="destructive" onClick={handleDelete}>
									<Trash2 />
									{t.delete}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<CreateDropdown parentCatalogNodeId={item.id}>
							<Button
								className="size-6 hover:bg-border"
								size="icon"
								variant="ghost"
							>
								<Plus />
							</Button>
						</CreateDropdown>
					</div>
				</div>
			</CatalogItemWrapper>

			<LevelIndicator nodeId={item.id} />
		</div>
	);
};

export default CatalogItem;
