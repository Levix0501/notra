import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';

import dayjs from 'dayjs';

import { ENV_LOCALE } from '@/constants/env';

import { Dictionary } from './dictionary';
import { en, zh } from './messages';

const langMap: Record<string, Dictionary> = {
	en,
	zh
};

const messages = langMap[ENV_LOCALE] ?? en;

export const getTranslations = <T extends keyof Dictionary>(
	module: T
): Dictionary[T] => messages[module];

export const dayjsLocale = ENV_LOCALE === 'zh' ? 'zh-cn' : 'en';

dayjs.locale(dayjsLocale);
