'use client';

import { Redo2Icon, Undo2Icon } from 'lucide-react';
import { useEditorRef, useEditorSelector } from 'platejs/react';
import * as React from 'react';

import { getTranslations } from '@/i18n';

import { ToolbarButton } from './toolbar';

const t = getTranslations('notra_editor');

export function RedoToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const editor = useEditorRef();
	const disabled = useEditorSelector(
		(editor) => editor.history.redos.length === 0,
		[]
	);

	return (
		<ToolbarButton
			{...props}
			disabled={disabled}
			tooltip={t.history_toolbar_button_redo}
			onClick={() => editor.redo()}
			onMouseDown={(e) => e.preventDefault()}
		>
			<Redo2Icon />
		</ToolbarButton>
	);
}

export function UndoToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const editor = useEditorRef();
	const disabled = useEditorSelector(
		(editor) => editor.history.undos.length === 0,
		[]
	);

	return (
		<ToolbarButton
			{...props}
			disabled={disabled}
			tooltip={t.history_toolbar_button_undo}
			onClick={() => editor.undo()}
			onMouseDown={(e) => e.preventDefault()}
		>
			<Undo2Icon />
		</ToolbarButton>
	);
}
