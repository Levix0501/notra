import { BookEntity } from '@prisma/client';

import { CARD_LIST_PAGE_SIZE } from '@/constants/pagination';
import DocService from '@/services/doc';

import DocCard from './doc-card';
import { MoreDocs } from './more-docs';
import { ViewCount } from './view-count';

export interface IndexPageCardViewProps {
	bookId?: BookEntity['id'];
}

export const IndexPageCardView = async ({
	bookId
}: Readonly<IndexPageCardViewProps>) => {
	const { data: docs } = await DocService.getPublishedDocMetaList({
		bookId,
		page: 1,
		pageSize: CARD_LIST_PAGE_SIZE
	});
	const { data: totalCount } = await DocService.getPublishedDocTotalCount({
		bookId
	});

	return (
		<div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 md:py-10">
			{docs?.map((doc) => (
				<DocCard key={doc.id} doc={doc}>
					<ViewCount bookId={bookId} docId={doc.id} type="DocCardServer" />
				</DocCard>
			))}

			<MoreDocs bookId={bookId} totalCount={totalCount ?? 0} />
		</div>
	);
};
