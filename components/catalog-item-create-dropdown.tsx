'use client';

import { BookEntity, TreeNodeEntity } from '@prisma/client';
import { Plus, FolderOpen, FileText } from 'lucide-react';
import { PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCreateCatalogItem } from '@/hooks/use-create-catalog-item';
import { getTranslations } from '@/i18n';

export interface CatalogItemCreateDropdownProps extends PropsWithChildren {
	bookId: BookEntity['id'];
	parentTreeNodeId: TreeNodeEntity['parentId'];
}

const t = getTranslations('components_catalog_item_create_dropdown');

export function CatalogItemCreateDropdown({
	bookId,
	parentTreeNodeId,
	children
}: Readonly<CatalogItemCreateDropdownProps>) {
	const createCatalogItem = useCreateCatalogItem({
		bookId,
		parentTreeNodeId
	});

	if (!createCatalogItem) {
		return null;
	}

	const handleCreateDoc = () => {
		createCatalogItem('DOC');
	};

	const handleCreateGroup = () => {
		createCatalogItem('GROUP');
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
				{children || (
					<Button className="size-8" size="icon" variant="outline">
						<Plus size={16} />
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
				<DropdownMenuItem onClick={handleCreateDoc}>
					<FileText className="text-popover-foreground" />
					{t.new_doc}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleCreateGroup}>
					<FolderOpen className="text-popover-foreground" />
					{t.new_group}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
