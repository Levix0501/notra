import { JSONContent } from '@tiptap/react';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';

import { ExtensionKit } from './extension-kit';

interface EditorViewProps {
	content: JSONContent;
}

export const EditorView = ({ content }: EditorViewProps) => {
	return renderToReactElement({
		extensions: ExtensionKit,
		content
	});
};
