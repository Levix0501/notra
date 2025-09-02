import { JSONContent } from '@tiptap/react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { EditorView } from '@/components/editor/editor-view';
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
	const { data: doc } = await DocService.getPublishedDoc(bookSlug, docSlug);

	return {
		title: doc?.title,
		description: doc?.summary,
		openGraph: {
			type: 'article',
			title: doc?.title,
			description: doc?.summary ?? '',
			...(doc?.cover ? { images: { url: doc.cover } } : void 0)
		},
		twitter: {
			title: doc?.title,
			card: 'summary_large_image',
			description: doc?.summary ?? '',
			...(doc?.cover ? { images: { url: doc.cover } } : void 0)
		}
	};
};

export const generateStaticParams = async ({ params }: Readonly<PageProps>) => {
	const { book: bookSlug } = await params;
	const { data: docs } = await DocService.getPublishedDocsByBookSlug(bookSlug);

	return docs?.map((doc) => ({ book: bookSlug, doc: doc.slug })) ?? [];
};

export default async function Page({ params }: Readonly<PageProps>) {
	const { book: bookSlug, doc: docSlug } = await params;
	const { data: doc } = await DocService.getPublishedDoc(bookSlug, docSlug);

	if (!doc) {
		notFound();
	}

	return (
		<article className="notra-editor mx-auto max-w-screen-md px-4">
			<h1 className="mt-6 mb-8 font-heading text-4xl font-bold">{doc.title}</h1>
			<EditorView content={doc.draftContent as unknown as JSONContent} />
		</article>
	);
}
