import { BookType } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { BlogPageMeta } from '@/components/blog-page-meta';
import { DocFooterNav } from '@/components/doc-footer-nav';
import { EditButton } from '@/components/edit-button';
import { EditorView } from '@/components/editor/editor-view';
import { ViewCountUpdater } from '@/components/view-count-updater';
import { BookService } from '@/services/book';
import { DocService } from '@/services/doc';

interface PageProps {
	params: Promise<{
		slug: string;
		doc: string;
	}>;
}

export const generateMetadata = async ({
	params
}: Readonly<PageProps>): Promise<Metadata> => {
	const { slug: bookSlug, doc: docSlug } = await params;
	const { data: doc } = await DocService.getPublishedDoc(bookSlug, docSlug);

	return {
		title: doc?.title,
		description: doc?.summary,
		openGraph: {
			type: 'article',
			title: doc?.title,
			description: doc?.summary ?? '',
			publishedTime: doc?.publishedAt?.toISOString(),
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

export const generateStaticParams = async () => {
	return [];
};

export default async function Page({ params }: Readonly<PageProps>) {
	const { slug: bookSlug, doc: docSlug } = await params;
	const { data: doc } = await DocService.getPublishedDoc(bookSlug, docSlug);
	const { data: book } = await BookService.getPublishedBookBySlug(bookSlug);

	if (!doc || !book) {
		notFound();
	}

	return (
		<div className="min-w-0 flex-1 md:px-16">
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
					<h1>
						{doc.title} <EditButton bookId={book.id} docId={doc.id} />
					</h1>

					{book?.type === BookType.BLOGS && (
						<BlogPageMeta docId={doc.id} publishedAt={doc.publishedAt} />
					)}

					<ViewCountUpdater docId={doc.id} />

					{doc.content && (
						<EditorView content={doc.content as unknown as JSONContent} />
					)}
				</article>

				<DocFooterNav bookId={book.id} bookSlug={bookSlug} docId={doc.id} />
			</div>
		</div>
	);
}
