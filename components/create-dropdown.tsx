'use client';

import { CatalogNodeEntity, CatalogNodeType } from '@prisma/client';
import { Plus, FolderOpen, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { useCurrentBook } from '@/stores/book';
import useCatalog, { mutateCatalog } from '@/stores/catalog';

export interface CreateDropdownProps extends PropsWithChildren {
	parentCatalogNodeId: CatalogNodeEntity['parentId'];
}

const t = getTranslations('components_create_dropdown');

export default function CreateDropdown({
	parentCatalogNodeId,
	children
}: Readonly<CreateDropdownProps>) {
	const { data: book } = useCurrentBook();
	const expandedKeys = useCatalog((state) => state.expandedKeys);
	const setExpandedKeys = useCatalog((state) => state.setExpandedKeys);
	const router = useRouter();

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

		const promise = (async () => {
			const result =
				type === 'DOC'
					? await createDoc(book.id, parentCatalogNodeId)
					: await createStack(book.id, parentCatalogNodeId);

			if (!result.success) {
				throw new Error(result.message);
			}

			return result.data;
		})();

		toast
			.promise(promise, {
				loading: t.create_loading,
				success: t.create_success,
				error: t.create_error
			})
			.unwrap()
			.then((data) => {
				if (type === 'DOC' && data?.docId) {
					router.push(`/dashboard/${book.id}/${data.docId}`);
				}

				mutateCatalog(book.id);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleCreateDocument = async () => {
		create('DOC');
	};

	const handleCreateStack = async () => {
		create('STACK');
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
				<DropdownMenuItem onClick={handleCreateDocument}>
					<FileText className="text-popover-foreground" />
					{t.new_document}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleCreateStack}>
					<FolderOpen className="text-popover-foreground" />
					{t.new_stack}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
