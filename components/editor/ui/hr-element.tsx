'use client';

import {
	PlateElement,
	useFocused,
	useReadOnly,
	useSelected
} from '@udecode/plate/react';

import { cn } from '@/lib/utils';

import type { PlateElementProps } from '@udecode/plate/react';

export function HrElement(props: PlateElementProps) {
	const readOnly = useReadOnly();
	const selected = useSelected();
	const focused = useFocused();

	return (
		<PlateElement {...props}>
			<div className="py-6" contentEditable={false}>
				<hr
					className={cn(
						'h-0.5 rounded-sm border-none bg-muted bg-clip-content',
						selected && focused && 'ring-2 ring-ring ring-offset-2',
						!readOnly && 'cursor-pointer'
					)}
				/>
			</div>
			{props.children}
		</PlateElement>
	);
}
