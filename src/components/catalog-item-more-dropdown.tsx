import { BookEntity } from '@prisma/client';
import {
	Ellipsis,
	FileSliders,
	Globe,
	GlobeLock,
	TextCursorInput,
	Trash2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
	deleteTreeNodeWithChildren,
	publishWithParent,
	unpublishWithChildren
} from '@/actions/tree-node';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/app-context';
import { getTranslations } from '@/i18n';
import { deleteNode, publishNode, unpublishNode } from '@/lib/tree/client';
import { useGetBook } from '@/queries/book';
import { DemoService } from '@/services/demo';
import { useCurrentDocMeta, useDocStore } from '@/stores/doc';
import { mutateTree, BOOK_CATALOG_MAP } from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { useDocSettingsSheet } from './doc-settings-sheet';

interface CatalogItemMoreDropdownProps {
	bookId: BookEntity['id'];
	item: TreeNodeVoWithLevel;
	onRename: () => void;
}

const t = getTranslations('components_catalog_item_more_dropdown');

export const CatalogItemMoreDropdown = ({
	bookId,
	item,
	onRename
}: CatalogItemMoreDropdownProps) => {
	const { docId } = useParams<{ bookId: string; docId: string }>();
	const router = useRouter();
	const { data: book } = useGetBook(bookId);
	const { data: docMeta, mutate } = useCurrentDocMeta();
	const { isDemo } = useApp();

	if (!book || (!docMeta && docId)) {
		return null;
	}

	const handleOpenSettingsDialog = () => {
		if (item.type === 'DOC' && item.docId) {
			useDocSettingsSheet.setState({
				open: true,
				docId: item.docId
			});
		}
	};

	const handleDelete = () => {
		const [nodeIds, docIds] = deleteNode(BOOK_CATALOG_MAP, item.id);

		mutateTree(book.id, BOOK_CATALOG_MAP, isDemo, async () => {
			const promise = (async () => {
				const result = isDemo
					? await DemoService.deleteTreeNodeWithChildren({
							nodeId: item.id,
							nodeIds,
							docIds,
							bookId: book.id
						})
					: await deleteTreeNodeWithChildren({
							nodeId: item.id,
							nodeIds,
							docIds,
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

		if (item.docId === useDocStore.getState().id) {
			router.replace(isDemo ? `/demo/${book.id}` : `/dashboard/${book.id}`);
		}
	};

	const handlePublish = () => {
		if (isDemo) {
			toast.warning(t.demo_mode_cannot_publish);

			return;
		}

		const [nodeIds, docIds] = publishNode(BOOK_CATALOG_MAP, item.id);

		mutateTree(book.id, BOOK_CATALOG_MAP, isDemo, async () => {
			const promise = (async () => {
				const result = await publishWithParent({
					nodeIds,
					docIds,
					bookId: book.id,
					bookType: book.type
				});

				if (!result.success || !result.data) {
					throw new Error(result.message);
				}

				return result.data;
			})();

			return await toast
				.promise(promise, {
					loading: t.publish_loading,
					success: t.publish_success,
					error: t.publish_error
				})
				.unwrap();
		});

		const currentDocId = useDocStore.getState().id;

		if (docMeta && currentDocId !== null && docIds.includes(currentDocId)) {
			mutate(
				async () => ({
					...docMeta,
					isPublished: true
				}),
				{
					optimisticData: {
						...docMeta,
						isPublished: true
					},
					revalidate: false
				}
			);
		}
	};

	const handleUnpublish = () => {
		const [nodeIds, docIds] = unpublishNode(BOOK_CATALOG_MAP, item.id);

		mutateTree(book.id, BOOK_CATALOG_MAP, isDemo, async () => {
			const promise = (async () => {
				const result = await unpublishWithChildren({
					nodeIds,
					docIds,
					bookId: book.id,
					bookType: book.type
				});

				if (!result.success || !result.data) {
					throw new Error(result.message);
				}

				return result.data;
			})();

			return await toast
				.promise(promise, {
					loading: t.unpublish_loading,
					success: t.unpublish_success,
					error: t.unpublish_error
				})
				.unwrap();
		});

		const currentDocId = useDocStore.getState().id;

		if (docMeta && currentDocId !== null && docIds.includes(currentDocId)) {
			mutate(
				async () => ({
					...docMeta,
					isPublished: false
				}),
				{
					optimisticData: {
						...docMeta,
						isPublished: false
					},
					revalidate: false
				}
			);
		}
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				asChild
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
				}}
			>
				<Button className="size-6 hover:bg-border" size="icon" variant="ghost">
					<Ellipsis />
					<span className="sr-only">More</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
				<DropdownMenuItem onClick={onRename}>
					<TextCursorInput className="text-popover-foreground" />
					{t.rename}
				</DropdownMenuItem>

				{item.type === 'DOC' && (
					<DropdownMenuItem onClick={handleOpenSettingsDialog}>
						<FileSliders className="text-popover-foreground" />
						{t.settings}
					</DropdownMenuItem>
				)}

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onClick={item.isPublished ? handleUnpublish : handlePublish}
				>
					{item.isPublished ? (
						<Globe className="text-popover-foreground" />
					) : (
						<GlobeLock className="text-popover-foreground" />
					)}
					{item.isPublished ? t.unpublish : t.publish}
				</DropdownMenuItem>

				<DropdownMenuItem variant="destructive" onClick={handleDelete}>
					<Trash2 />
					{t.delete}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
