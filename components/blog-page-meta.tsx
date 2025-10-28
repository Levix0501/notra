import { DocEntity } from '@prisma/client';
import dayjs from 'dayjs';

import { BlogPageViews } from './blog-page-views';

interface BlogPageMetaProps {
	docId: DocEntity['id'];
	publishedAt: DocEntity['publishedAt'];
}

export const BlogPageMeta = ({ docId, publishedAt }: BlogPageMetaProps) => {
	return (
		<div className="flex items-center gap-3 text-sm text-muted-foreground">
			<span>{dayjs(publishedAt).format('YYYY-MM-DD')}</span>

			<BlogPageViews docId={docId} />
		</div>
	);
};
