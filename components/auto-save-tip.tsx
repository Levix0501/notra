'use client';

import dayjs from 'dayjs';

import { getTranslations } from '@/i18n';
import { useCurrentDocMeta, useDocStore } from '@/stores/doc';

const t = getTranslations('components_auto_save_tip');

export default function AutoSaveTip() {
	const updateAt = useDocStore((state) => state.updateAt);
	const isSaving = useDocStore((state) => state.isSaving);
	const isFirstLoad = useDocStore((state) => state.isFirstLoad);
	const { data } = useCurrentDocMeta();

	if (!data) {
		return null;
	}

	let tip = '';
	const formattedUpdateAt = dayjs(updateAt).format('YYYY-MM-DD HH:mm:ss');

	if (isSaving) {
		tip = t.saving;
	} else if (isFirstLoad) {
		tip = t.last_saved + ' ' + formattedUpdateAt;
	} else {
		tip = t.saved + ' ' + formattedUpdateAt;
	}

	return <span className="text-xs text-muted-foreground">{tip}</span>;
}
