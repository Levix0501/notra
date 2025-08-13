import { useCallback } from 'react';

import { updateDocMeta } from '@/actions/doc';
import { getTranslations } from '@/i18n';
import { useGetDocMeta } from '@/queries/doc';
import { mutateCatalog } from '@/stores/catalog';
import useDoc from '@/stores/doc';

const t = getTranslations('hooks_use_edit_doc_title');

export const useEditDocTitle = () => {
	const slug = useDoc((state) => state.slug);
	const { data, mutate } = useGetDocMeta(slug);
	const setIsSaving = useDoc((state) => state.setIsSaving);

	const handleEditDocTitle = useCallback(
		(newTitle: string) => {
			if (!data) {
				return;
			}

			if (newTitle.length === 0) {
				newTitle = t.untitled;
			}

			if (newTitle !== data.title) {
				mutate(
					async () => {
						setIsSaving(true);

						const result = await updateDocMeta({
							id: data.id,
							title: newTitle
						});

						if (!result.success || !result.data) {
							setIsSaving(false);

							throw new Error(result.message);
						}

						mutateCatalog(data.bookId);
						setIsSaving(false);

						return result.data;
					},
					{
						optimisticData: {
							...data,
							title: newTitle
						},
						revalidate: false
					}
				);
			}
		},
		[data, mutate, setIsSaving]
	);

	return handleEditDocTitle;
};
