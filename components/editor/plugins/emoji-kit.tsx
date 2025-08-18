'use client';

import emojiMartData from '@emoji-mart/data';
import { EmojiInputPlugin, EmojiPlugin } from '@platejs/emoji/react';

import { EmojiInputElement } from '@/components/editor/ui/emoji-node';

export const EmojiKit = [
	EmojiPlugin.configure({
		options: { data: emojiMartData as emojiMartData.EmojiMartData }
	}),
	EmojiInputPlugin.withComponent(EmojiInputElement)
];
