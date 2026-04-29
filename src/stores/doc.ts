import { DocEntity } from '@prisma/client';
import { useParams } from 'next/navigation';
import { create } from 'zustand';

import { useGetDocMeta } from '@/queries/doc';
import { Nullable } from '@/types/common';

type DocStore = {
	id: Nullable<DocEntity['id']>;
	setId: (id: DocEntity['id']) => void;
	updateAt: Nullable<DocEntity['updatedAt']>;
	setUpdateAt: (updateAt: DocEntity['updatedAt']) => void;
	isSaving: boolean;
	setIsSaving: (isSaving: boolean) => void;
	isFirstLoad: boolean;
	setIsFirstLoad: (isFirstLoad: boolean) => void;
};

export const useDocStore = create<DocStore>((set, get) => ({
	id: null,
	setId: (id) => {
		if (get().id === id) {
			return;
		}

		set({ id, isFirstLoad: true });
	},
	updateAt: null,
	setUpdateAt: (updateAt) => set({ updateAt }),
	isSaving: false,
	setIsSaving: (isSaving) => set({ isSaving, isFirstLoad: false }),
	isFirstLoad: true,
	setIsFirstLoad: (isFirstLoad) => set({ isFirstLoad })
}));

export const useCurrentDocMeta = () => {
	const { docId } = useParams<{ bookId: string; docId: string }>();

	return useGetDocMeta(Number(docId), {
		onSuccess(data) {
			useDocStore.getState().setId(data.id);
			useDocStore.getState().setUpdateAt(data.updatedAt);

			const titleArray = document.title.split(' - ');

			if (titleArray.length > 1) {
				document.title = data.title + ' - ' + titleArray[1];
			} else {
				document.title = data.title;
			}
		}
	});
};
