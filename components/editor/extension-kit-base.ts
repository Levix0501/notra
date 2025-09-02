import './styles/editor.scss';
import './extensions/blockquote/blockquote.scss';
import './extensions/code-block/code-block.scss';
import './extensions/heading/heading.scss';
import './extensions/horizontal-rule/horizontal-rule.scss';
import './extensions/image/image.scss';
import './extensions/list/list.scss';
import './extensions/paragraph/paragraph.scss';

import { Image } from '@tiptap/extension-image';
import { Extensions } from '@tiptap/react';

import { CodeBlockBase } from './extensions/code-block/code-block-extension-base';
import { HorizontalRule } from './extensions/horizontal-rule/horizontal-rule-extension';
import { Starter } from './extensions/starter/starter-extensiton';

export const ExtensionKitBase: Extensions = [
	Starter,
	HorizontalRule,
	Image,
	CodeBlockBase
];
