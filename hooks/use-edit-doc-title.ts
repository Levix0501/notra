import { useCallback } from 'react';

import { updateDocMeta } from '@/actions/doc';
import { getTranslations } from '@/i18n';
import { useCurrentDocMeta, useDocStore } from '@/stores/doc';
import { BOOK_CATALOG_MAP, mutateTree } from '@/stores/tree';

const t = getTranslations('hooks_use_edit_doc_title');

export const useEditDocTitle = () => {
	const { data, mutate } = useCurrentDocMeta();
	const setIsSaving = useDocStore((state) => state.setIsSaving);

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

						mutateTree(data.bookId, BOOK_CATALOG_MAP);
						setIsSaving(false);

						return result.data;
					},
					{
						optimisticData: {
							...data,
							title: newTitle
						}
					}
				);
			}
		},
		[data, mutate, setIsSaving]
	);

	return handleEditDocTitle;
};
