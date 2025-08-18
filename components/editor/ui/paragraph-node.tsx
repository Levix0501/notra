'use client';

import { PlateElement } from 'platejs/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import type { PlateElementProps } from 'platejs/react';

export function ParagraphElement(props: PlateElementProps) {
	return (
		<PlateElement {...props} className={cn('m-0 px-0 py-1')}>
			{props.children}
		</PlateElement>
	);
}
