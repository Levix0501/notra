'use client';

import * as React from 'react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { useHeading } from '../hooks/use-heading';
import { useTiptapEditor } from '../hooks/use-tiptap-editor';

import type { UseHeadingConfig } from '../hooks/use-heading';

export interface HeadingButtonProps extends UseHeadingConfig {
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

export const HeadingButton = ({
	editor: providedEditor,
	level
}: HeadingButtonProps) => {
	const { editor } = useTiptapEditor(providedEditor);
	const { isVisible, handleToggle, Icon, label } = useHeading({
		editor,
		level
	});

	const handleClick = React.useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (event.defaultPrevented) return;

			handleToggle();
		},
		[handleToggle]
	);

	if (!isVisible) {
		return null;
	}

	return (
		<DropdownMenuItem onClick={handleClick}>
			<Icon className="text-popover-foreground" />
			{label}
		</DropdownMenuItem>
	);
};
