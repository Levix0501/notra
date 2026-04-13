import Link from 'next/link';

import { BookEntity } from '@prisma/client';

import { CARD_LIST_PAGE_SIZE } from '@/constants/pagination';
import { getTranslations } from '@/i18n';
import { DocService } from '@/services/doc';

import { BlogCard } from './blog-card';
import { MoreBlogs } from './more-blogs';
import { Button } from './ui/button';

interface BlogCardsProps {
	bookId?: BookEntity['id'];
}

export const BlogCards = async ({ bookId }: BlogCardsProps) => {
	const { data } = await DocService.getPublishedBlogs({
		bookId,
		page: 1,
		pageSize: CARD_LIST_PAGE_SIZE
	});
	const { data: total } = await DocService.getPublishedBlogsCount({ bookId });
	const t = getTranslations('components_blog_cards');

	if (!data?.length) {
		return (
			<div className="mx-auto flex max-w-screen-md flex-col items-center gap-4 p-6 text-center">
				<div className="space-y-2">
					<h2 className="text-lg font-semibold">{t.empty_title}</h2>
					<p className="text-sm text-muted-foreground">{t.empty_description}</p>
				</div>
				<div className="flex flex-wrap items-center justify-center gap-2">
					<Button asChild size="sm">
						<Link href="/login">{t.sign_in}</Link>
					</Button>
					<Button asChild size="sm" variant="outline">
						<Link href="/demo">{t.try_demo}</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto grid max-w-screen-md gap-6 p-6">
			{data.map((blog) => (
				<BlogCard key={blog.id} isFirstPage blog={blog} bookId={bookId} />
			))}

			<MoreBlogs bookId={bookId} totalCount={total ?? 0} />
		</div>
	);
};
