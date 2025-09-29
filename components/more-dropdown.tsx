import {
	Globe,
	GlobeLock,
	MoreVertical,
	SlidersHorizontal,
	TextCursorInput,
	Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
	deleteNodeWithChildren,
	publishWithParent,
	unpublishWithChildren
} from '@/actions/catalog-node';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';
import { deleteNode, publishNode, unpublishNode } from '@/lib/catalog/client';
import { useCurrentBook } from '@/stores/book';
import { mutateCatalog, nodeMap } from '@/stores/catalog';
import { useCurrentDocMeta, useDocStore } from '@/stores/doc';
import { CatalogNodeVoWithLevel } from '@/types/catalog-node';

import { useGlobalSettingsDialog } from './global-settings-dialog';

interface MoreDropdownProps {
	item: CatalogNodeVoWithLevel;
	onRename: () => void;
}

const t = getTranslations('components_more_dropdown');

export const MoreDropdown = ({ item, onRename }: MoreDropdownProps) => {
	const router = useRouter();
	const { data: book } = useCurrentBook();
	const { data: docMeta, mutate } = useCurrentDocMeta();

	if (!book || !docMeta) {
		return null;
	}

	const handleOpenSettingsDialog = () => {
		if (item.type === 'DOC' && item.docId) {
			useGlobalSettingsDialog.setState({
				tab: 'doc',
				docId: item.docId,
				bookId: book.id,
				open: true
			});
		}
	};

	const handleDelete = () => {
		const [nodeIds, docIds] = deleteNode(nodeMap, item.id);

		mutateCatalog(book.id, async () => {
			const promise = (async () => {
				const result = await deleteNodeWithChildren({
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
			router.replace(`/dashboard/${book.id}`);
		}
	};

	const handlePublish = () => {
		const [nodeIds, docIds] = publishNode(nodeMap, item.id);

		mutateCatalog(book.id, async () => {
			const result = await publishWithParent({
				nodeIds,
				docIds,
				bookId: book.id
			});

			if (!result.success || !result.data) {
				throw new Error(result.message);
			}

			return result.data;
		});

		const currentDocId = useDocStore.getState().id;

		if (currentDocId !== null && docIds.includes(currentDocId)) {
			mutate(
				async () => ({
					...docMeta,
					isPublished: true,
					isUpdated: false
				}),
				{
					optimisticData: {
						...docMeta,
						isPublished: true,
						isUpdated: false
					},
					revalidate: false
				}
			);
		}
	};

	const handleUnpublish = () => {
		const [nodeIds, docIds] = unpublishNode(nodeMap, item.id);

		mutateCatalog(book.id, async () => {
			const result = await unpublishWithChildren({
				nodeIds,
				docIds,
				bookId: book.id
			});

			if (!result.success || !result.data) {
				throw new Error(result.message);
			}

			return result.data;
		});

		const currentDocId = useDocStore.getState().id;

		if (currentDocId !== null && docIds.includes(currentDocId)) {
			mutate(
				async () => ({
					...docMeta,
					isPublished: false,
					isUpdated: false
				}),
				{
					optimisticData: {
						...docMeta,
						isPublished: false,
						isUpdated: false
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
					<MoreVertical />
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
						<SlidersHorizontal className="text-popover-foreground" />
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
