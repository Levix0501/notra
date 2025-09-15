import { Extensions } from '@tiptap/react';

import { ExtensionKitBase } from './extension-kit-base';
import { CodeBlock } from './extensions/code-block/code-block-extension';
import { ResetEmptyToParagraph } from './extensions/paragraph/reset-empty-to-paragraph-extension';
import { SlashCommand } from './extensions/slash-command/slash-command-extension';

export const ExtensionKit: Extensions = [
	...ExtensionKitBase,
	CodeBlock,
	SlashCommand,
	ResetEmptyToParagraph
];
