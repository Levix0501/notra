import { JSONContent } from '@tiptap/react';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';

import { ExtensionKitBase } from './extension-kit-base';
import { CodeBlock } from './ui/code-block';

interface EditorViewProps {
	content: JSONContent;
}

export const EditorView = ({ content }: EditorViewProps) => {
	return renderToReactElement({
		extensions: ExtensionKitBase,
		content,
		options: {
			nodeMapping: {
				codeBlock: ({ node }) => {
					const language = node?.attrs?.language || 'auto';
					const text = node?.textContent || '';

					return <CodeBlock language={language} text={text} />;
				}
			}
		}
	});
};
