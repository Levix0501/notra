import { Content } from '@tiptap/react';

interface NotraEditorViewProps {
	content: Content;
}

export default function NotraEditorView({
	content
}: Readonly<NotraEditorViewProps>) {
	return <div>{JSON.stringify(content)}</div>;
}
