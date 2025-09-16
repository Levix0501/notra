import './styles/editor.scss';
import './styles/heading.scss';
import './styles/blockquote.scss';
import './styles/code-block.scss';
import './styles/horizontal-rule.scss';
import './styles/image.scss';
import './styles/list.scss';
import './styles/paragraph.scss';

import { Image } from '@tiptap/extension-image';
import { Extensions } from '@tiptap/react';

import { CodeBlockBase } from './extensions/code-block-extension-base';
import { HorizontalRule } from './extensions/horizontal-rule-extension';
import { Starter } from './extensions/starter-extensiton';

export const ExtensionKitBase: Extensions = [
	Starter,
	HorizontalRule,
	Image,
	CodeBlockBase
];
