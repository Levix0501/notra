'use client';

import { KEYS } from 'platejs';
import { BlockPlaceholderPlugin } from 'platejs/react';

import { getTranslations } from '@/i18n';

const t = getTranslations('notra_editor');

export const BlockPlaceholderKit = [
	BlockPlaceholderPlugin.configure({
		options: {
			className:
				'before:absolute before:cursor-text before:opacity-30 before:content-[attr(placeholder)]',
			placeholders: {
				[KEYS.p]: t.block_placeholder_kit_paragraph
			},
			query: ({ path }) => {
				return path.length === 1;
			}
		}
	})
];
