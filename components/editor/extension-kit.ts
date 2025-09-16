import { Image } from '@tiptap/extension-image';
import { Extensions, ReactNodeViewRenderer } from '@tiptap/react';

import { ExtensionKitBase } from './extension-kit-base';
import { CodeBlock } from './extensions/code-block-extension';
import { ImageUpload } from './extensions/image-upload-extension';
import { ResetEmptyToParagraph } from './extensions/reset-empty-to-paragraph-extension';
import { SlashCommand } from './extensions/slash-command-extension';
import { handleImageUpload, MAX_FILE_SIZE } from './tiptap-utils';
import { ImageNode } from './ui/image-node';

export const ExtensionKit: Extensions = [
	...ExtensionKitBase,
	CodeBlock,
	SlashCommand,
	ResetEmptyToParagraph,
	ImageUpload.configure({
		accept: 'image/*',
		maxSize: MAX_FILE_SIZE,
		limit: 3,
		upload: handleImageUpload,
		onError: (error) => console.error('Upload failed:', error)
	}),
	Image.extend({
		addNodeView() {
			return ReactNodeViewRenderer(ImageNode);
		}
	})
];
