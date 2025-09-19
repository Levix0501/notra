import { JSONContent } from '@tiptap/react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { DocMeta } from '@/components/doc-meta';
import { EditorView } from '@/components/editor/editor-view';
import { ViewCountUpdater } from '@/components/view-count-updater';
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
		<div className="min-w-0 md:px-16">
			<div className="max-w-screen-md">
				{doc.cover && (
					<div className="relative aspect-video w-full">
						<Image
							fill
							alt={doc.title}
							className="rounded-[4px]"
							sizes="768px"
							src={doc.cover}
						/>
					</div>
				)}
				<article className="notra-editor pt-6">
					<h1>{doc.title}</h1>

					<DocMeta publishedAt={doc.publishedAt} viewCount={doc.viewCount} />

					<ViewCountUpdater docId={doc.id} />

					{doc.content && (
						<EditorView content={doc.content as unknown as JSONContent} />
					)}
				</article>
			</div>
		</div>
	);
}
