import { SlateElement } from 'platejs';
import * as React from 'react';

import { cn } from '@/lib/utils';

import type { SlateElementProps } from 'platejs';

export function ParagraphElementStatic(props: SlateElementProps) {
	return (
		<SlateElement {...props} className={cn('m-0 px-0 py-1')}>
			{props.children}
		</SlateElement>
	);
}
