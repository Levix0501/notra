import { BookEntity } from '@prisma/client';

import { CARD_LIST_PAGE_SIZE } from '@/constants/pagination';
import { DocService } from '@/services/doc';

import { BlogCard } from './blog-card';
import { MoreBlogs } from './more-blogs';

interface BlogCardsProps {
	bookId?: BookEntity['id'];
}

export const BlogCards = async ({ bookId }: BlogCardsProps) => {
	const { data } = await DocService.getPublishedBlogs({
		bookId,
		page: 1,
		pageSize: CARD_LIST_PAGE_SIZE
	});

	return (
		<div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 md:py-10">
			{data?.blogs?.map((blog) => (
				<BlogCard key={blog.id} isFirstPage blog={blog} bookId={bookId} />
			))}

			<MoreBlogs bookId={bookId} totalCount={data?.total ?? 0} />
		</div>
	);
};
