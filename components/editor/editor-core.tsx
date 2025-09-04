'use client';

import { Content, EditorContent, useEditor } from '@tiptap/react';

import { Spacer } from '@/components/ui/spacer';

import { ExtensionKit } from './extension-kit';
import { FixedToolbar } from './ui/fixed-toolbar';

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
		<>
			<FixedToolbar>
				<Spacer />
				123
				<Spacer />
			</FixedToolbar>
			<EditorContent
				className="flex size-full flex-1 flex-col"
				editor={editor}
			/>
		</>
	);
};
