import { JSONContent } from '@tiptap/react';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';
import Image from 'next/image';

import { isAllowedDomain } from '@/lib/image';

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
					const src = node.attrs.src;

					return (
						<div className="flex items-center justify-center">
							{isAllowedDomain(src) ? (
								<Image
									alt={node.attrs.alt}
									height={node.attrs.height ?? 1}
									sizes="100%"
									src={node.attrs.src}
									width={node.attrs.width ?? 1}
								/>
							) : (
								<picture>
									<img
										alt={node.attrs.alt}
										height={node.attrs.height ?? void 0}
										src={node.attrs.src}
										width={node.attrs.width ?? void 0}
									/>
								</picture>
							)}
						</div>
					);
				}
			}
		}
	});
};
