import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';

export const lowlight = createLowlight(all);

export const preClassName = 'hljs max-h-[500px] overflow-auto scrollbar-hide';

export const CodeBlockBase = CodeBlockLowlight.extend({
	addOptions() {
		return {
			...this.parent?.(),
			HTMLAttributes: {
				class: preClassName
			}
		};
	}
}).configure({
	lowlight
});
