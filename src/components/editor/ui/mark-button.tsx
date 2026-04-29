'use client';

import * as React from 'react';

import type { UseMarkConfig } from '@/components/editor/hooks/use-mark';
import { useMark } from '@/components/editor/hooks/use-mark';
import { useTiptapEditor } from '@/components/editor/hooks/use-tiptap-editor';
import { Button } from '@/components/ui/button';

export interface MarkButtonProps extends UseMarkConfig {
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

export const MarkButton = ({ type }: MarkButtonProps) => {
	const { editor } = useTiptapEditor();
	const { isVisible, handleMark, label, canToggle, isActive, Icon } = useMark({
		editor,
		type
	});

	const handleClick = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			if (event.defaultPrevented) return;

			handleMark();
		},
		[handleMark]
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
