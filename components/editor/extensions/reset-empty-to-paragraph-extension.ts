import { Editor, Extension } from '@tiptap/react';

export const ResetEmptyToParagraph = Extension.create({
	name: 'resetEmptyToParagraph',

	addKeyboardShortcuts() {
		return {
			Backspace: ({ editor }) => {
				return tryResetEmptyNode(editor);
			},
			Delete: ({ editor }) => {
				return tryResetEmptyNode(editor);
			}
		};
	}
});

function tryResetEmptyNode(editor: Editor) {
	const { state, commands } = editor;
	const { selection } = state;
	const { empty, $from } = selection;

	if (!empty) {
		return false;
	}

	const parent = $from.parent;
	const parentType = parent.type.name;

	if (parent.content.size === 0 && parentType !== 'paragraph') {
		commands.setNode('paragraph');

		return true;
	}

	return false;
}
