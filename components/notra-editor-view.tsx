import { createSlateEditor, PlateStatic, Value } from 'platejs';

import { BaseEditorKit } from './editor/editor-base-kit';

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

	return <PlateStatic editor={editor} />;
}
