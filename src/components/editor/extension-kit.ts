import { Focus, Placeholder } from '@tiptap/extensions';
import { Extensions } from '@tiptap/react';

import { getTranslations } from '@/i18n';

import { SharedExtensions } from './extension-kit-base';
import { CodeBlock } from './extensions/code-block-extension';
import { FileHandler } from './extensions/file-handler-extension';
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
	}),
	FileHandler,
	Focus,
	Placeholder.configure({
		placeholder: ({ node }) => {
			if (node.type.name === 'paragraph') {
				return getTranslations('notra_editor').placeholder;
			}

			return '';
		}
	})
];
