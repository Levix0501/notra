'use client';

import { ParagraphPlugin } from '@udecode/plate/react';
import { AlignPlugin } from '@udecode/plate-alignment/react';
import { HEADING_LEVELS } from '@udecode/plate-heading';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';

export const alignPlugin = AlignPlugin.extend({
	inject: {
		targetPlugins: [
			ParagraphPlugin.key,
			...HEADING_LEVELS,
			MediaEmbedPlugin.key,
			ImagePlugin.key
		]
	}
});
