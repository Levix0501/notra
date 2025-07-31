import { ENV_LOCALE } from '@/constants/env';

import { Dictionary } from './dictionary';
import { en, zh } from './messages';

const langMap: Record<string, Dictionary> = {
	en,
	zh
};

const messages = langMap[ENV_LOCALE] ?? en;

export const getTranslations = (module: keyof Dictionary) => messages[module];
