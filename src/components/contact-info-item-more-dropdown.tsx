import { BookEntity, BookType } from '@prisma/client';
import { Ellipsis, Globe, GlobeLock, Pencil, Trash2 } from 'lucide-react';
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
import { CONTACT_INFO_MAP, mutateTree } from '@/stores/tree';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { useContactInfoSheet } from './contact-info-sheet';
import { useTreeNodeDeleteDialog } from './tree-node-delete-dialog';

interface ContactInfoItemMoreDropdownProps {
	bookId: BookEntity['id'];
	item: TreeNodeVoWithLevel;
}

const t = getTranslations('components_nav_item_more_dropdown');

export const ContactInfoItemMoreDropdown = ({
	bookId,
	item
}: ContactInfoItemMoreDropdownProps) => {
	const handleEdit = () => {
		useContactInfoSheet.setState({
			open: true,
			id: item.id
		});
	};

	const handlePublish = () => {
		const [nodeIds, docIds] = publishNode(CONTACT_INFO_MAP, item.id);

		mutateTree(bookId, CONTACT_INFO_MAP, false, async () => {
			const promise = (async () => {
				const result = await publishWithParent({
					nodeIds,
					docIds,
					bookId,
					bookType: BookType.CONTACT
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
		const [nodeIds, docIds] = unpublishNode(CONTACT_INFO_MAP, item.id);

		mutateTree(bookId, CONTACT_INFO_MAP, false, async () => {
			const promise = (async () => {
				const result = await unpublishWithChildren({
					nodeIds,
					docIds,
					bookId,
					bookType: BookType.CONTACT
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
						useTreeNodeDeleteDialog.setState({
							open: true,
							id: item.id,
							bookId,
							type: 'contact'
						})
					}
				>
					<Trash2 />
					{t.delete}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
