'use client';

import { Plus } from 'lucide-react';

import { useGetCatalogNodes } from '@/queries/catalog-node';
import { useSetBook } from '@/stores/book';
import { BookVo } from '@/types/book';

import CreateDropdown from './create-dropdown';
import { NotraSidebarButton } from './notra-sidebar';
import NotraSkeleton from './notra-skeleton';

export interface BookCatalogProps {
	book: BookVo;
}

export default function BookCatalog({ book }: Readonly<BookCatalogProps>) {
	useSetBook(book);
	const { data: nodes, isLoading } = useGetCatalogNodes(book.id);

	return (
		<div className="relative size-full">
			{isLoading && (
				<div className="px-4 md:px-2.5">
					<NotraSkeleton />
				</div>
			)}

			{!isLoading && (
				<CreateDropdown parentCatalogNodeId={null}>
					<div className="h-9 px-4 py-px md:px-2.5">
						<NotraSidebarButton className="h-[34px] text-secondary-foreground">
							<Plus size={16} /> <span>新增</span>
						</NotraSidebarButton>
					</div>
				</CreateDropdown>
			)}
		</div>
	);
}
