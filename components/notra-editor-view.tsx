import { createSlateEditor, Value } from 'platejs';

import { BaseEditorKit } from './editor/editor-base-kit';
import { EditorStatic } from './editor/ui/editor-static';

interface NotraEditorViewProps {
	content: Value;
}

export default function NotraEditorView({
	content
}: Readonly<NotraEditorViewProps>) {
	const editor = createSlateEditor({
		plugins: BaseEditorKit,
		value: content
	});

	return <EditorStatic editor={editor} />;
}
