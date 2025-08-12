'use client';

import { Plus } from 'lucide-react';
import { RefObject, useRef } from 'react';
import { useResizeObserver } from 'usehooks-ts';

import { getTranslations } from '@/i18n';
import { useGetCatalogNodes } from '@/queries/catalog-node';
import { useSetBook } from '@/stores/book';
import useCatalog, { setNodeMap } from '@/stores/catalog';
import { BookVo } from '@/types/book';

import CreateDropdown from './create-dropdown';
import DragDropZone from './drag-drop-zone';
import { NotraSidebarButton } from './notra-sidebar';
import NotraSkeleton from './notra-skeleton';

export interface BookCatalogProps {
	book: BookVo;
}

const t = getTranslations('components_book_catalog');

export default function BookCatalog({ book }: Readonly<BookCatalogProps>) {
	const ref = useRef<HTMLDivElement>(null);
	const hasDefaultExpandedKeysGenerated = useRef(false);

	useSetBook(book);
	const { height = 9999 } = useResizeObserver({
		ref: ref as RefObject<HTMLElement>
	});
	const expandedKeys = useCatalog((state) => state.expandedKeys);
	const setExpandedKeys = useCatalog((state) => state.setExpandedKeys);
	const { data, isLoading } = useGetCatalogNodes(book.id, {
		onSuccess(data) {
			setNodeMap(data);

			if (data && !hasDefaultExpandedKeysGenerated.current) {
				hasDefaultExpandedKeysGenerated.current = true;
				const defaultExpandedKeys = data
					.filter((node) => node.level === 0)
					.map((node) => node.id);

				setExpandedKeys(defaultExpandedKeys);
			}
		}
	});
	const draggableList = (data ?? []).filter(
		(node) =>
			node.level === 0 || (node.parentId && expandedKeys.has(node.parentId))
	);

	return (
		<div className="relative size-full">
			<div ref={ref} className="absolute h-full w-px"></div>

			{isLoading && (
				<div className="px-4 md:px-2.5">
					<NotraSkeleton />
				</div>
			)}

			{!isLoading && (
				<CreateDropdown parentCatalogNodeId={null}>
					<div className="h-9 px-4 py-px md:px-2.5">
						<NotraSidebarButton className="h-[34px] text-secondary-foreground">
							<Plus size={16} /> <span>{t.new}</span>
						</NotraSidebarButton>
					</div>
				</CreateDropdown>
			)}

			{!isLoading && data && data.length > 0 && (
				<DragDropZone draggableList={draggableList} height={height} />
			)}
		</div>
	);
}
