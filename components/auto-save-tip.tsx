'use client';

import dayjs from 'dayjs';

import { getTranslations } from '@/i18n';
import { useGetDocMeta } from '@/queries/doc';
import useDoc from '@/stores/doc';

const t = getTranslations('components_auto_save_tip');

export default function AutoSaveTip() {
	const isSaving = useDoc((state) => state.isSaving);
	const isFirstLoad = useDoc((state) => state.isFirstLoad);
	const slug = useDoc((state) => state.slug);
	const { data } = useGetDocMeta(slug);

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
