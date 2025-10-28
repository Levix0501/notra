import { BookEntity } from '@prisma/client';
import Link from 'next/link';
import { CSSProperties } from 'react';

import { useGetBook } from '@/queries/book';
import { ChildrenProps } from '@/types/common';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

export interface CatalogItemWrapperProps extends ChildrenProps {
	className?: string;
	style?: CSSProperties;
	bookId: BookEntity['id'];
	item: TreeNodeVoWithLevel;
	isEditingTitle?: boolean;
	onClick?: () => void;
}

export function CatalogItemWrapper({
	children,
	className,
	style,
	bookId,
	isEditingTitle,
	item,
	onClick
}: Readonly<CatalogItemWrapperProps>) {
	const { data: book } = useGetBook(bookId);

	if (item.type === 'DOC' && !isEditingTitle) {
		return (
			<Link
				className={className}
				href={`/dashboard/${book?.id}/${item.docId}`}
				style={style}
				onClick={onClick}
			>
				{children}
			</Link>
		);
	}

	return (
		<div
			className={className}
			role="button"
			style={style}
			onClick={isEditingTitle ? void 0 : onClick}
		>
			{children}
		</div>
	);
}
