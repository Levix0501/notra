'use client';

import * as React from 'react';

import { useTiptapEditor } from '@/components/editor/hooks/use-tiptap-editor';
import { Button } from '@/components/ui/button';

import {
	useImageUpload,
	UseImageUploadConfig
} from '../hooks/use-image-upload';

export interface ImageUploadButtonProps extends UseImageUploadConfig {
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

export const ImageUploadButton = () => {
	const { editor } = useTiptapEditor();
	const { isVisible, canInsert, handleImage, label, isActive, Icon } =
		useImageUpload({
			editor
		});

	const handleClick = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			if (event.defaultPrevented) return;

			handleImage();
		},
		[handleImage]
	);

	if (!isVisible) {
		return null;
	}

	return (
		<Button
			aria-label={label}
			aria-pressed={isActive}
			data-active-state={isActive ? 'on' : 'off'}
			data-disabled={!canInsert}
			data-style="ghost"
			disabled={!canInsert}
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
