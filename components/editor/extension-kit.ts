import './styles/editor.scss';
import './extensions/blockquote/blockquote.scss';
import './extensions/heading/heading.scss';
import './extensions/image/image.scss';
import './extensions/list/list.scss';
import './extensions/paragraph/paragraph.scss';

import { Image } from '@tiptap/extension-image';
import { Extensions } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

import { CodeBlock } from './extensions/code-block';
import { HorizontalRule } from './extensions/horizontal-rule';

export const ExtensionKit: Extensions = [
	StarterKit.configure({
		horizontalRule: false,
		link: {
			openOnClick: false,
			enableClickSelection: true
		}
	}),
	HorizontalRule,
	Image,
	CodeBlock
];
