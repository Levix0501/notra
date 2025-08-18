import {
	BaseCodeBlockPlugin,
	BaseCodeLinePlugin,
	BaseCodeSyntaxPlugin
} from '@platejs/code-block';
import { all, createLowlight } from 'lowlight';

import {
	CodeBlockElementWithPreview,
	CodeLineElementStatic,
	CodeSyntaxLeafStatic
} from '@/components/editor/ui/code-block-node-static';

const lowlight = createLowlight(all);

export const BaseCodeBlockKit = [
	BaseCodeBlockPlugin.configure({
		node: { component: CodeBlockElementWithPreview },
		options: { lowlight }
	}),
	BaseCodeLinePlugin.withComponent(CodeLineElementStatic),
	BaseCodeSyntaxPlugin.withComponent(CodeSyntaxLeafStatic)
];
