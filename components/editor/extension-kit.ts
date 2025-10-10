import { Extensions } from '@tiptap/react';

import { SharedExtensions } from './extension-kit-base';
import { CodeBlock } from './extensions/code-block-extension';
import { Image } from './extensions/image-extension';
import { ImageUpload } from './extensions/image-upload-extension';
import { ResetEmptyToParagraph } from './extensions/reset-empty-to-paragraph-extension';
import { SlashCommand } from './extensions/slash-command-extension';
import { handleImageUpload, MAX_FILE_SIZE } from './tiptap-utils';

export const ExtensionKit: Extensions = [
	...SharedExtensions,
	CodeBlock,
	SlashCommand,
	ResetEmptyToParagraph,
	Image,
	ImageUpload.configure({
		accept: 'image/*',
		maxSize: MAX_FILE_SIZE,
		limit: 3,
		upload: handleImageUpload,
		onError: (error) => console.error('Upload failed:', error)
	})
];
