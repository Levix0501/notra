import './styles/editor.scss';

import { Image } from '@tiptap/extension-image';
import { JSONContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';

import { HorizontalRule } from './nodes/horizontal-rule-node/horizontal-rule-node-extension';

interface EditorViewProps {
	content: JSONContent;
}

export const EditorView = ({ content }: EditorViewProps) => {
	return renderToReactElement({
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
		content
	});
};
