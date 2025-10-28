'use client';

import { DocEntity } from '@prisma/client';
import { Eye } from 'lucide-react';

import { useGetPublishedBlog } from '@/queries/doc';

interface BlogPageViewsProps {
	docId: DocEntity['id'];
}

export const BlogPageViews = ({ docId }: BlogPageViewsProps) => {
	const { data: blog } = useGetPublishedBlog(docId);

	return (
		<div className="flex items-center gap-0.5">
			<Eye size={16} />
			<span>{blog?.viewCount}</span>
		</div>
	);
};
