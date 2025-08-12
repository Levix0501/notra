import { CSSProperties } from 'react';

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
	onClick
}: Readonly<CatalogItemWrapperProps>) {
	return (
		<div className={className} role="button" style={style} onClick={onClick}>
			{children}
		</div>
	);
}
