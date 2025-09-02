import { JSONContent } from '@tiptap/react';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';
import { toHtml } from 'hast-util-to-html';
import { createLowlight, all } from 'lowlight';

import { ExtensionKit } from './extension-kit';
import { CodeBlockStatic } from './extensions/code-block/code-block-static';

const lowlight = createLowlight(all);

interface EditorViewProps {
	content: JSONContent;
}

export const EditorView = ({ content }: EditorViewProps) => {
	return renderToReactElement({
		extensions: ExtensionKit,
		content,
		options: {
			nodeMapping: {
				codeBlock: ({ node }) => {
					const language = node?.attrs?.language || 'plaintext';
					const text = node?.textContent || '';

					const tree = lowlight.highlight(language, text);
					const inner = toHtml(tree);

					return <CodeBlockStatic html={inner} />;
				}
			}
		}
	});
};
