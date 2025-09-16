import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';

export const lowlight = createLowlight(all);

export const CodeBlockBase = CodeBlockLowlight.configure({
	lowlight
});
