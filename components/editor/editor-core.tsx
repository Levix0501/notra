'use client';

import './styles/editor.scss';

import { Image } from '@tiptap/extension-image';
import { Content, EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

import { HorizontalRule } from './nodes/horizontal-rule-node/horizontal-rule-node-extension';

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
					'flex-1 px-4 sm:px-[max(64px,calc(50%-375px))] pb-[30vh] pt-4 sm:pt-12 outline-none'
			}
		},
		extensions: [
			StarterKit.configure({
				horizontalRule: false,
				link: {
					openOnClick: false,
					enableClickSelection: true
				}
			}),
			HorizontalRule,
			Image
		],
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
