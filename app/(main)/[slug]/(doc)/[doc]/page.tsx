import { BookType } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { BlogPageMeta } from '@/components/blog-page-meta';
import { BookCatalogStaticTrigger } from '@/components/book-catalog-static-client';
import { CommentsSection } from '@/components/comments';
import { DocFooterNav } from '@/components/doc-footer-nav';
import { DocToc, DocTocPopover } from '@/components/doc-toc';
import { EditButton } from '@/components/edit-button';
import { EditorView } from '@/components/editor/editor-view';
import { PublicStorageImg } from '@/components/public-storage-img';
import { ViewCountUpdater } from '@/components/view-count-updater';
import { isLoopbackImageUrl, normalizeStorageImageUrl } from '@/lib/image';
import { getToc } from '@/lib/utils';
import { BookService } from '@/services/book';
import { DocService } from '@/services/doc';
import { TreeNodeService } from '@/services/tree-node';

export const dynamic = 'force-dynamic';

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
	const coverUrl = normalizeStorageImageUrl(doc?.cover);
	const ogImageUrl =
		coverUrl && !isLoopbackImageUrl(coverUrl) ? coverUrl : undefined;

	return {
		title: doc?.title,
		description: doc?.summary,
		openGraph: {
			type: 'article',
			title: doc?.title,
			description: doc?.summary ?? '',
			publishedTime: doc?.publishedAt?.toISOString(),
			...(ogImageUrl ? { images: { url: ogImageUrl } } : void 0)
		},
		twitter: {
			title: doc?.title,
			card: 'summary_large_image',
			description: doc?.summary ?? '',
			...(ogImageUrl ? { images: { url: ogImageUrl } } : void 0)
		}
	};
};

export const generateStaticParams = async () => {
	return [];
};

export default async function Page({ params }: Readonly<PageProps>) {
	const session = await auth();
	const { slug: bookSlug, doc: docSlug } = await params;
	const { data: doc } = await DocService.getPublishedDoc(bookSlug, docSlug);
	const { data: book } = await BookService.getPublishedBookBySlug(bookSlug);
	const coverUrl = normalizeStorageImageUrl(doc?.cover);

	if (!doc || !book) {
		notFound();
	}

	const { data: treeNodes } =
		await TreeNodeService.getPublishedTreeNodesByBookId(book.id);
	const hasCatalog =
		book.type === BookType.DOCS && treeNodes && treeNodes.length > 0;

	const toc = getToc(doc.content as JSONContent);
	const hasToc = toc.length > 0;

	return (
		<>
			<div className="min-w-0 flex-1 ">
				{(hasCatalog || hasToc) && (
					<div className="sticky top-header-height z-20 flex h-12 items-center justify-between border-b bg-background px-6 md:hidden [&_button]:h-full [&_button]:p-0 [&_button]:text-xs [&_button]:text-muted-foreground">
						{hasCatalog && <BookCatalogStaticTrigger />}
						{hasToc && <DocTocPopover toc={toc} />}
					</div>
				)}

				<div className="px-6 lg:px-12">
					<div className="mx-auto max-w-screen-md">
						{coverUrl && (
							<PublicStorageImg
								alt={doc.title}
								className="aspect-video w-full rounded-[4px]"
								imgClassName="rounded-[4px]"
								src={coverUrl}
							/>
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
						<CommentsSection
							canDelete={session?.user?.role === 'ADMIN'}
							canModerate={session?.user?.role === 'ADMIN'}
							docId={doc.id}
						/>
					</div>
				</div>
			</div>

			<aside className="sticky top-20 hidden h-doc-aside-height w-64 shrink-0 overflow-y-auto lg:block">
				{toc.length > 0 && <DocToc toc={toc} />}
			</aside>
		</>
	);
}
