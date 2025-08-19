import { createSlateEditor, PlateStatic, Value } from 'platejs';

import { BaseEditorKit } from './editor/editor-base-kit';

interface NotraEditorViewProps {
	initialValue?: Value;
}

export default function NotraEditorView({
	initialValue
}: Readonly<NotraEditorViewProps>) {
	const editor = createSlateEditor({
		plugins: BaseEditorKit,
		value: initialValue
	});

	return <PlateStatic editor={editor} />;
}
