'use client';

import { insertInlineEquation } from '@platejs/math';
import { RadicalIcon } from 'lucide-react';
import { useEditorRef } from 'platejs/react';
import * as React from 'react';

import { ToolbarButton } from './toolbar';

export function InlineEquationToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const editor = useEditorRef();

	return (
		<ToolbarButton
			{...props}
			tooltip="Mark as equation"
			onClick={() => {
				insertInlineEquation(editor);
			}}
		>
			<RadicalIcon />
		</ToolbarButton>
	);
}
