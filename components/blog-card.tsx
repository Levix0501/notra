import { BookEntity } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { PublishedBlogVo } from '@/types/doc';

import { BlogCardMeta, FirstPageMeta } from './blog-card-meta';

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
	return (
		<Link
			className="group overflow-hidden rounded-xl border"
			href={`/${blog.book.slug}/${blog.slug}`}
		>
			<div className="relative aspect-video overflow-hidden border-b">
				{blog.cover ? (
					<Image
						fill
						alt={blog.title}
						className="sm:transition-transform sm:ease-in-out sm:group-hover:scale-105"
						sizes="(max-width:639px) 100vw, (max-width:767px) 50vw, 33vw"
						src={blog.cover}
					/>
				) : (
					<div className="flex size-full items-center justify-center p-3 text-center text-xl font-extrabold break-all sm:transition-transform sm:ease-in-out sm:group-hover:scale-105">
						{blog.title}
					</div>
				)}
			</div>

			<div className="space-y-2 p-4.5">
				{blog.cover && (
					<div className="line-clamp-2 text-xl font-semibold break-all">
						{blog.title}
					</div>
				)}
				<div
					className={cn(
						'text-sm break-all',
						blog.cover ? 'line-clamp-3' : 'line-clamp-2'
					)}
				>
					{blog.summary}
				</div>
			</div>

			{isFirstPage ? (
				<FirstPageMeta bookId={bookId} docId={blog.id} />
			) : (
				<BlogCardMeta
					publishedAt={blog.publishedAt}
					viewCount={blog.viewCount}
				/>
			)}
		</Link>
	);
};
