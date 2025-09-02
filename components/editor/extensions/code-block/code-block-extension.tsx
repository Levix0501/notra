import {
	NodeViewContent,
	NodeViewWrapper,
	ReactNodeViewRenderer
} from '@tiptap/react';

import { CopyButton } from '@/components/copy-button';

import { CodeBlockBase, preClassName } from './code-block-extension-base';

export const CodeBlock = CodeBlockBase.extend({
	addNodeView() {
		return ReactNodeViewRenderer(({ node }) => (
			<NodeViewWrapper>
				<div className="relative">
					<CopyButton
						className="absolute top-2 right-2"
						value={node.textContent}
					/>
					<pre className={preClassName}>
						<code>
							<NodeViewContent />
						</code>
					</pre>
				</div>
			</NodeViewWrapper>
		));
	}
});
