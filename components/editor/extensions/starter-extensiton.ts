import { StarterKit } from '@tiptap/starter-kit';

export const Starter = StarterKit.configure({
	horizontalRule: false,
	link: {
		openOnClick: false,
		enableClickSelection: true
	},
	codeBlock: false
});
