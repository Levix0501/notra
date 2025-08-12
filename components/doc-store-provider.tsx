'use client';

import { useEffect } from 'react';

import useDoc from '@/stores/doc';

interface DocStoreProviderProps {
	slug: string;
}

export default function DocStoreProvider({
	slug
}: Readonly<DocStoreProviderProps>) {
	const setSlug = useDoc((state) => state.setSlug);

	useEffect(() => {
		setSlug(slug);
	}, [slug, setSlug]);

	return null;
}
