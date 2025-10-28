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
import { useCreateTreeNode } from '@/hooks/use-create-tree-node';
import { getTranslations } from '@/i18n';

export interface CreateDropdownProps extends PropsWithChildren {
	bookId: BookEntity['id'];
	parentTreeNodeId: TreeNodeEntity['parentId'];
}

const t = getTranslations('components_create_dropdown');

export function CreateDropdown({
	bookId,
	parentTreeNodeId,
	children
}: Readonly<CreateDropdownProps>) {
	const createTreeNode = useCreateTreeNode({
		bookId,
		parentTreeNodeId
	});

	if (!createTreeNode) {
		return null;
	}

	const handleCreateDoc = () => {
		createTreeNode('DOC');
	};

	const handleCreateGroup = () => {
		createTreeNode('GROUP');
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
