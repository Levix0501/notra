'use client';

import { DocEntity } from '@prisma/client';
import { useEffect } from 'react';

import useDoc from '@/stores/doc';

interface DocStoreProviderProps {
	id: DocEntity['id'];
	slug: DocEntity['slug'];
}

export default function DocStoreProvider({
	id,
	slug
}: Readonly<DocStoreProviderProps>) {
	const setId = useDoc((state) => state.setId);
	const setSlug = useDoc((state) => state.setSlug);

	useEffect(() => {
		setId(id);
		setSlug(slug);
	}, [id, slug, setId, setSlug]);

	return null;
}
