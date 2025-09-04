'use client';

import * as React from 'react';

import { useTiptapEditor } from '@/components/editor/hooks/use-tiptap-editor';
import { Button } from '@/components/ui/button';

import { useUndoRedo } from './use-undo-redo';

import type { UseUndoRedoConfig } from './use-undo-redo';

export type UndoRedoButtonProps = UseUndoRedoConfig;

export const UndoRedoButton = ({
	editor: providedEditor,
	action,
	hideWhenUnavailable = false,
	onExecuted
}: UndoRedoButtonProps) => {
	const { editor } = useTiptapEditor(providedEditor);
	const { isVisible, handleAction, canExecute, Icon } = useUndoRedo({
		editor,
		action,
		hideWhenUnavailable,
		onExecuted
	});

	const handleClick = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			if (event.defaultPrevented) return;

			handleAction();
		},
		[handleAction]
	);

	if (!isVisible) {
		return null;
	}

	return (
		<Button
			className="size-7 p-0"
			disabled={!canExecute}
			variant="ghost"
			onClick={handleClick}
		>
			<Icon size={16} />
		</Button>
	);
};

UndoRedoButton.displayName = 'UndoRedoButton';
