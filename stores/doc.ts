import { create } from 'zustand';

type DocStore = {
	slug: string | undefined;
	setSlug: (slug: string) => void;
};

const useDoc = create<DocStore>((set) => ({
	slug: void 0,
	setSlug: (slug) => set({ slug })
}));

export default useDoc;
