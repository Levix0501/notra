'use client';

import { BookEntity, DocEntity } from '@prisma/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Eye } from 'lucide-react';

import { useGetFirstPagePublishedBlogs } from '@/queries/doc';

dayjs.extend(relativeTime);

interface BlogCardMetaProps {
	publishedAt: Date;
	viewCount: number;
}

export const BlogCardMeta = ({
	publishedAt,
	viewCount
}: Readonly<BlogCardMetaProps>) => {
	return <Meta publishedAt={publishedAt} viewCount={viewCount} />;
};

function Meta({
	publishedAt,
	viewCount
}: {
	publishedAt?: Date;
	viewCount?: number;
}) {
	if (!publishedAt && !viewCount) {
		return <div className="h-5"></div>;
	}

	return (
		<div className="flex items-center gap-3 text-sm text-muted-foreground">
			<span>{dayjs(publishedAt).fromNow()}</span>

			<div className="flex items-center gap-0.5">
				<Eye size={16} />
				<span>{viewCount}</span>
			</div>
		</div>
	);
}

export function FirstPageMeta({
	docId,
	bookId
}: {
	docId: DocEntity['id'];
	bookId?: BookEntity['id'];
}) {
	const { data } = useGetFirstPagePublishedBlogs(bookId);

	const blog = data?.find((blog) => blog.id === docId);

	return <Meta publishedAt={blog?.publishedAt} viewCount={blog?.viewCount} />;
}
