import Link from 'next/link';
import { CSSProperties } from 'react';

import { useCurrentBook } from '@/stores/book';
import { CatalogNodeVoWithLevel } from '@/types/catalog-node';
import { ChildrenProps } from '@/types/common';

export interface CatalogItemWrapperProps extends ChildrenProps {
	className?: string;
	style?: CSSProperties;
	item: CatalogNodeVoWithLevel;
	isEditingTitle?: boolean;
	onClick?: () => void;
}

export default function CatalogItemWrapper({
	children,
	className,
	style,
	isEditingTitle,
	item,
	onClick
}: Readonly<CatalogItemWrapperProps>) {
	const { data: book } = useCurrentBook();

	if (item.type === 'DOC' && !isEditingTitle) {
		return (
			<Link
				className={className}
				href={`/dashboard/${book?.slug}/${item.url}`}
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
