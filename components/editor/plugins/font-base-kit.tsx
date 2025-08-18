import {
	BaseFontBackgroundColorPlugin,
	BaseFontColorPlugin,
	BaseFontFamilyPlugin,
	BaseFontSizePlugin
} from '@platejs/basic-styles';
import { KEYS } from 'platejs';

import type { SlatePluginConfig } from 'platejs';

const options = {
	inject: { targetPlugins: [KEYS.p] }
} satisfies SlatePluginConfig;

export const BaseFontKit = [
	BaseFontColorPlugin.configure(options),
	BaseFontBackgroundColorPlugin.configure(options),
	BaseFontSizePlugin.configure(options),
	BaseFontFamilyPlugin.configure(options)
];
