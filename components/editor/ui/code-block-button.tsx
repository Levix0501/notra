'use client';

import * as React from 'react';

import { useTiptapEditor } from '@/components/editor/hooks/use-tiptap-editor';
import { Button } from '@/components/ui/button';

import { useCodeBlock, UseCodeBlockConfig } from '../hooks/use-code-block';

export interface CodeBlockButtonProps extends UseCodeBlockConfig {
	/**
	 * Optional text to display alongside the icon.
	 */
	text?: string;
	/**
	 * Optional show shortcut keys in the button.
	 * @default false
	 */
	showShortcut?: boolean;
}

export const CodeBlockButton = () => {
	const { editor } = useTiptapEditor();
	const {
		isVisible,
		canToggle,
		isActive,
		handleToggle,
		label,

		Icon
	} = useCodeBlock({
		editor
	});

	const handleClick = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			if (event.defaultPrevented) return;

			handleToggle();
		},
		[handleToggle]
	);

	if (!isVisible) {
		return null;
	}

	return (
		<Button
			aria-label={label}
			aria-pressed={isActive}
			data-active-state={isActive ? 'on' : 'off'}
			data-disabled={!canToggle}
			data-style="ghost"
			disabled={!canToggle}
			isActive={isActive}
			role="button"
			size="icon"
			tabIndex={-1}
			type="button"
			variant="ghost"
			onClick={handleClick}
		>
			<Icon />
		</Button>
	);
};
