import { Image as ImageBase } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ImageNode } from '../ui/image-node';

export const Image = ImageBase.extend({
	addNodeView() {
		return ReactNodeViewRenderer(ImageNode);
	}
});
