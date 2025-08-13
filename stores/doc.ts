import { DocEntity } from '@prisma/client';
import { create } from 'zustand';

import { Nullable } from '@/types/common';

type DocStore = {
	id: DocEntity['id'] | undefined;
	setId: (id: DocEntity['id']) => void;
	slug: Nullable<DocEntity['slug']>;
	setSlug: (slug: DocEntity['slug']) => void;
	isSaving: boolean;
	setIsSaving: (isSaving: boolean) => void;
	isFirstLoad: boolean;
	setIsFirstLoad: (isFirstLoad: boolean) => void;
};

const useDoc = create<DocStore>((set) => ({
	id: void 0,
	setId: (id) => set({ id }),
	slug: null,
	setSlug: (slug) => set({ slug }),
	isSaving: false,
	setIsSaving: (isSaving) => set({ isSaving, isFirstLoad: false }),
	isFirstLoad: true,
	setIsFirstLoad: (isFirstLoad) => set({ isFirstLoad })
}));

export default useDoc;
