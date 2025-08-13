import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import DocService from '@/services/doc';

interface PageProps {
	params: Promise<{
		doc: string;
	}>;
}

export const generateMetadata = async ({
	params
}: Readonly<PageProps>): Promise<Metadata> => {
	const { doc: slug } = await params;
	const { data: doc } = await DocService.getDoc(slug);

	return {
		title: doc?.title
	};
};

export default async function Page({ params }: Readonly<PageProps>) {
	const { doc: slug } = await params;
	const { data: doc } = await DocService.getDoc(slug);

	if (!doc) {
		notFound();
	}

	return <div>doc page</div>;
}
