'use client';

import { CatalogNodeEntity, CatalogNodeType } from '@prisma/client';
import { Plus, Folder, File } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { toast } from 'sonner';

import { createDoc, createStack } from '@/actions/catalog-node';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';
import { useBook } from '@/stores/book';
import useCatalog, { mutateCatalog } from '@/stores/catalog';

export interface CreateDropdownProps extends PropsWithChildren {
	parentCatalogNodeId: CatalogNodeEntity['parentId'];
}

const t = getTranslations('components_create_dropdown');

export default function CreateDropdown({
	parentCatalogNodeId,
	children
}: Readonly<CreateDropdownProps>) {
	const book = useBook();
	const expandedKeys = useCatalog((state) => state.expandedKeys);
	const setExpandedKeys = useCatalog((state) => state.setExpandedKeys);

	if (!book) {
		return null;
	}

	const create = async (type: CatalogNodeType) => {
		if (
			parentCatalogNodeId !== null &&
			!expandedKeys.has(parentCatalogNodeId)
		) {
			expandedKeys.add(parentCatalogNodeId);
			setExpandedKeys(expandedKeys);
		}

		try {
			const result =
				type === 'DOC'
					? await createDoc(book.id, parentCatalogNodeId)
					: await createStack(book.id, parentCatalogNodeId);

			if (!result.success) {
				toast.error(result.message);

				return;
			}

			mutateCatalog(book.id);
		} catch {
			toast.error(t.create_error);
		}
	};

	const handleCreateDocument = async () => {
		create('DOC');
	};

	const handleCreateStack = async () => {
		create('STACK');
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
				{children || (
					<Button className="size-8" size="icon" variant="outline">
						<Plus size={16} />
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
				<DropdownMenuItem onClick={handleCreateDocument}>
					<File />
					{t.new_document}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleCreateStack}>
					<Folder />
					{t.new_stack}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
