import {
	NodeViewContent,
	NodeViewWrapper,
	ReactNodeViewRenderer
} from '@tiptap/react';

import { CopyButton } from '@/components/copy-button';

import { CodeBlockBase } from './code-block-extension-base';
import { LanguageSelect } from '../ui/language-select';

export const CodeBlock = CodeBlockBase.extend({
	addNodeView() {
		return ReactNodeViewRenderer(({ node, updateAttributes }) => (
			<NodeViewWrapper>
				<div className="relative">
					<pre className="hljs !p-0">
						<div className="flex h-9 items-center justify-between px-2">
							<LanguageSelect
								language={node.attrs.language || 'auto'}
								onLanguageChange={(language) => updateAttributes({ language })}
							/>
							<CopyButton value={node.textContent} />
						</div>
						<code className="!p-0">
							<NodeViewContent className="scrollbar-hide max-h-[500px] overflow-auto p-4 pt-0" />
						</code>
					</pre>
				</div>
			</NodeViewWrapper>
		));
	}
});
