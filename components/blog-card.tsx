import { BookEntity } from '@prisma/client';
import Link from 'next/link';

import { normalizeStorageImageUrl } from '@/lib/image';
import { PublishedBlogVo } from '@/types/doc';

import { BlogCardMeta, FirstPageMeta } from './blog-card-meta';
import { PublicStorageImg } from './public-storage-img';

interface BlogCardProps {
	bookId?: BookEntity['id'];
	blog: PublishedBlogVo;
	isFirstPage?: boolean;
}

export const BlogCard = ({
	bookId,
	blog,
	isFirstPage = false
}: Readonly<BlogCardProps>) => {
	const coverUrl = normalizeStorageImageUrl(blog.cover);

	return (
		<Link href={`/${blog.book.slug}/${blog.slug}`}>
			<article className="group flex flex-col-reverse overflow-hidden rounded-xl border sm:flex-row sm:items-start sm:gap-6 sm:p-6">
				<div className="space-y-2 p-4 sm:p-0">
					<div className="line-clamp-2 text-base font-semibold break-all sm:line-clamp-1 sm:text-xl">
						{blog.title}
					</div>
					<div className="line-clamp-2 text-sm break-all text-secondary-foreground">
						{blog.summary}
					</div>

					{isFirstPage ? (
						<FirstPageMeta bookId={bookId} docId={blog.id} />
					) : (
						<BlogCardMeta
							publishedAt={blog.publishedAt}
							viewCount={blog.viewCount}
						/>
					)}
				</div>

				{coverUrl && (
					<PublicStorageImg
						alt={blog.title}
						className="aspect-video border-b sm:w-48 sm:shrink-0 sm:rounded-md sm:border-0"
						imgClassName="sm:transition-transform sm:ease-in-out sm:group-hover:scale-105"
						src={coverUrl}
					/>
				)}
			</article>
		</Link>
	);
};
