import { DocEntity } from '@prisma/client';
import { useParams } from 'next/navigation';
import { create } from 'zustand';

import { useGetDocMeta } from '@/queries/doc';
import { Nullable } from '@/types/common';

type DocStore = {
	id: Nullable<DocEntity['id']>;
	setId: (id: DocEntity['id']) => void;

	isSaving: boolean;
	setIsSaving: (isSaving: boolean) => void;
	isFirstLoad: boolean;
	setIsFirstLoad: (isFirstLoad: boolean) => void;
};

export const useDocStore = create<DocStore>((set) => ({
	id: null,
	setId: (id) => set({ id }),
	isSaving: false,
	setIsSaving: (isSaving) => set({ isSaving, isFirstLoad: false }),
	isFirstLoad: true,
	setIsFirstLoad: (isFirstLoad) => set({ isFirstLoad })
}));

export const useCurrentDocMeta = () => {
	const { book, doc } = useParams<{ book: string; doc: string }>();

	return useGetDocMeta(
		{ book, doc },
		{
			onSuccess(data) {
				useDocStore.getState().setId(data.id);

				const titleArray = document.title.split(' - ');

				if (titleArray.length > 1) {
					document.title = data.title + ' - ' + titleArray[1];
				} else {
					document.title = data.title;
				}
			}
		}
	);
};
