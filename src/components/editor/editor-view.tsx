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
				},
				heading: ({ node, parent }) => {
					const index = parent?.children.indexOf(node);

					switch (node.attrs.level) {
						case 1:
							return <h1 data-id={`h1-${index}`}>{node.textContent}</h1>;
						case 2:
							return <h2 data-id={`h2-${index}`}>{node.textContent}</h2>;
						case 3:
							return <h3 data-id={`h3-${index}`}>{node.textContent}</h3>;
						case 4:
							return <h4 data-id={`h4-${index}`}>{node.textContent}</h4>;
						case 5:
							return <h5 data-id={`h5-${index}`}>{node.textContent}</h5>;
						case 6:
							return <h6 data-id={`h6-${index}`}>{node.textContent}</h6>;
						default:
							return null;
					}
				}
			}
		}
	});
};
