import { Image as BaseImage } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ImageNode } from '../ui/image-node';

export const Image = BaseImage.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			'data-source': {
				default: null,
				parseHTML: (element) => element.getAttribute('data-source'),
				renderHTML: (attributes) => {
					if (!attributes['data-source']) {
						return {};
					}

					return {
						'data-source': attributes['data-source']
					};
				}
			}
		};
	},
	addNodeView() {
		return ReactNodeViewRenderer(ImageNode);
	}
});
