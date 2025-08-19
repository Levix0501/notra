import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Value } from 'platejs';

import NotraEditorView from '@/components/notra-editor-view';
import DocService from '@/services/doc';

interface PageProps {
	params: Promise<{
		book: string;
		doc: string;
	}>;
}

export const generateMetadata = async ({
	params
}: Readonly<PageProps>): Promise<Metadata> => {
	const { book: bookSlug, doc: docSlug } = await params;
	const { data: doc } = await DocService.getDoc(bookSlug, docSlug);

	return {
		title: doc?.title
	};
};

export const generateStaticParams = async ({ params }: Readonly<PageProps>) => {
	const { book: bookSlug } = await params;
	const { data: docs } = await DocService.getDocsByBookSlug(bookSlug);

	return docs?.map((doc) => ({ book: bookSlug, doc: doc.slug })) ?? [];
};

export default async function Page({ params }: Readonly<PageProps>) {
	const { book: bookSlug, doc: docSlug } = await params;
	const { data: doc } = await DocService.getDoc(bookSlug, docSlug);

	if (!doc) {
		notFound();
	}

	return (
		<NotraEditorView initialValue={doc.draftContent as unknown as Value} />
	);
}
