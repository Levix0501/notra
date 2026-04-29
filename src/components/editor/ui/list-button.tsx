'use client';

import * as React from 'react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { useList, UseListConfig } from '../hooks/use-list';
import { useTiptapEditor } from '../hooks/use-tiptap-editor';

export interface ListButtonProps extends UseListConfig {
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

export const ListButton = ({
	editor: providedEditor,
	type
}: ListButtonProps) => {
	const { editor } = useTiptapEditor(providedEditor);
	const { isVisible, handleToggle, label, Icon } = useList({
		editor,
		type
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
