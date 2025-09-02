import './code-block.scss';

import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';

const lowlight = createLowlight(all);

export const CodeBlock = CodeBlockLowlight.extend({
	addOptions() {
		return {
			...this.parent?.(),
			HTMLAttributes: {
				class: 'hljs'
			}
		};
	}
}).configure({
	lowlight
});
