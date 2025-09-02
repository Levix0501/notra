import { toHtml } from 'hast-util-to-html';

import { CopyButton } from '@/components/copy-button';

import {
	lowlight,
	preClassName
} from '../extensions/code-block/code-block-extension-base';

interface CodeBlockProps {
	language: string;
	text: string;
}

export const CodeBlock = ({ language, text }: CodeBlockProps) => {
	const tree = lowlight.highlight(language, text);
	const html = toHtml(tree);

	return (
		<div className="relative">
			<CopyButton className="absolute top-2 right-2" value={text} />

			<pre className={preClassName}>
				<code dangerouslySetInnerHTML={{ __html: html }} />
			</pre>
		</div>
	);
};
