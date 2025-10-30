import { BookEntity, BookType } from '@prisma/client';
import {
	Ellipsis,
	Globe,
	GlobeLock,
	Pencil,
	TextCursorInput,
	Trash2
} from 'lucide-react';
import { toast } from 'sonner';

import { publishWithParent, unpublishWithChildren } from '@/actions/tree-node';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';
import { publishNode, unpublishNode } from '@/lib/tree/client';
import { mutateTree, nodeMap } from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { useNavItemDeleteDialog } from './nav-item-delete-dialog';
import { useNavItemSheet } from './nav-item-sheet';

interface NavItemMoreDropdownProps {
	bookId: BookEntity['id'];
	item: TreeNodeVoWithLevel;
	onRename: () => void;
}

const t = getTranslations('components_nav_item_more_dropdown');

export const NavItemMoreDropdown = ({
	bookId,
	item,
	onRename
}: NavItemMoreDropdownProps) => {
	const handleEdit = () => {
		useNavItemSheet.setState({
			open: true,
			id: item.id
		});
	};

	const handlePublish = () => {
		const [nodeIds, docIds] = publishNode(nodeMap, item.id);

		mutateTree(bookId, async () => {
			const promise = (async () => {
				const result = await publishWithParent({
					nodeIds,
					docIds,
					bookId,
					bookType: BookType.NAVBAR
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
	};

	const handleUnpublish = () => {
		const [nodeIds, docIds] = unpublishNode(nodeMap, item.id);

		mutateTree(bookId, async () => {
			const promise = (async () => {
				const result = await unpublishWithChildren({
					nodeIds,
					docIds,
					bookId,
					bookType: BookType.NAVBAR
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
			<DropdownMenuContent
				align="start"
				onClick={(e) => e.stopPropagation()}
				onCloseAutoFocus={(e) => e.preventDefault()}
			>
				<DropdownMenuItem onClick={handleEdit}>
					<Pencil />
					{t.edit}
				</DropdownMenuItem>

				<DropdownMenuItem onClick={onRename}>
					<TextCursorInput className="text-popover-foreground" />
					{t.rename}
				</DropdownMenuItem>

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

				<DropdownMenuItem
					variant="destructive"
					onClick={() =>
						useNavItemDeleteDialog.setState({ open: true, id: item.id })
					}
				>
					<Trash2 />
					{t.delete}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
