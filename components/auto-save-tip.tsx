'use client';

import dayjs from 'dayjs';

import { getTranslations } from '@/i18n';
import { useCurrentDocMeta, useDocStore } from '@/stores/doc';

const t = getTranslations('components_auto_save_tip');

export default function AutoSaveTip() {
	const isSaving = useDocStore((state) => state.isSaving);
	const isFirstLoad = useDocStore((state) => state.isFirstLoad);
	const { data } = useCurrentDocMeta();

	if (!data) {
		return null;
	}

	let tip = '';
	const updateAt = dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss');

	if (isSaving) {
		tip = t.auto_save_tip_saving;
	} else if (isFirstLoad) {
		tip = t.auto_save_tip_last_saved + ' ' + updateAt;
	} else {
		tip = t.auto_save_tip_saved + ' ' + updateAt;
	}

	return <span className="text-xs text-muted-foreground">{tip}</span>;
}
