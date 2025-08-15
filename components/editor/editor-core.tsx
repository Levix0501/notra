'use client';

import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/editor/ui/editor';

export function EditorCore() {
	const editor = usePlateEditor({
		plugins: EditorKit
	});

	return (
		<Plate editor={editor}>
			<EditorContainer>
				<Editor />
			</EditorContainer>
		</Plate>
	);
}
