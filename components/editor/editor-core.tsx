'use client';

import { Content, EditorContent, useEditor } from '@tiptap/react';

import { ExtensionKit } from './extension-kit';

interface EditorCoreProps {
	initialContent: Content;
	onContentChange?: (content: Content) => void;
}

export const EditorCore = ({
	initialContent,
	onContentChange
}: EditorCoreProps) => {
	const editor = useEditor({
		immediatelyRender: false,
		shouldRerenderOnTransaction: false,
		editorProps: {
			attributes: {
				autocomplete: 'off',
				autocorrect: 'off',
				autocapitalize: 'off',
				'aria-label': 'Main content area, start typing to enter text.',
				class:
					'notra-editor flex-1 px-4 sm:px-[max(64px,calc(50%-375px))] pb-[30vh] pt-4 sm:pt-12 outline-none'
			}
		},
		extensions: ExtensionKit,
		onUpdate(props) {
			onContentChange?.(props.editor.getJSON());
		},
		content: initialContent
	});

	return (
		<div className="size-full">
			<EditorContent className="flex size-full flex-col" editor={editor} />
		</div>
	);
};
