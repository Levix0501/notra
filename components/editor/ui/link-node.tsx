'use client';

import { useLink } from '@platejs/link/react';
import { PlateElement } from 'platejs/react';

import type { TLinkElement } from 'platejs';
import type { PlateElementProps } from 'platejs/react';

export function LinkElement(props: PlateElementProps<TLinkElement>) {
	const { props: linkProps } = useLink({ element: props.element });

	return (
		<PlateElement
			{...props}
			as="a"
			attributes={{
				...props.attributes,
				...linkProps
			}}
			className="font-medium text-primary underline decoration-primary underline-offset-4"
		>
			{props.children}
		</PlateElement>
	);
}
