import { JSONContent } from '@tiptap/react';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';
import Image from 'next/image';

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
				},
				image: ({ node }) => {
					return (
						<div className="flex items-center justify-center">
							<Image
								alt={node.attrs.alt}
								height={node.attrs.height}
								src={node.attrs.src}
								width={node.attrs.width}
							/>
						</div>
					);
				}
			}
		}
	});
};
