import { BookEntity } from '@prisma/client';

import DocService from '@/services/doc';

import DocCard from './doc-card';
import { MoreDocs } from './more-docs';

export interface IndexPageCardViewProps {
	bookSlug?: BookEntity['slug'];
}

export const IndexPageCardView = async ({
	bookSlug
}: Readonly<IndexPageCardViewProps>) => {
	const { data: docs } = await DocService.getPublishedDocMetaList({
		bookSlug,
		page: 1,
		pageSize: 24
	});
	const { data: totalCount } = await DocService.getPublishedDocTotalCount({
		bookSlug
	});

	return (
		<div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 md:py-10">
			{docs?.map((doc) => (
				<DocCard key={doc.id} doc={doc} />
			))}

			<MoreDocs bookSlug={bookSlug} totalCount={totalCount ?? 0} />
		</div>
	);
};
