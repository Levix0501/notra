import { Extensions } from '@tiptap/react';

import { ExtensionKitBase } from './extension-kit-base';
import { CodeBlock } from './extensions/code-block/code-block-extension';

export const ExtensionKit: Extensions = [...ExtensionKitBase, CodeBlock];
