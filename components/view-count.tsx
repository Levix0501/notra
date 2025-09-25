'use client';

import { BookEntity, DocEntity } from '@prisma/client';

import { CARD_LIST_PAGE_SIZE } from '@/constants/pagination';
import {
	useGetPublishedDocsViews,
	useGetPublishedDocViews
} from '@/queries/doc';

interface ViewCountProps {
	docId: DocEntity['id'];
	bookId?: BookEntity['id'];
	viewCount?: DocEntity['viewCount'];
	type: 'DocCardServer' | 'DocCardClient' | 'DocPage';
}

export const ViewCount = ({
	docId,
	bookId,
	viewCount,
	type
}: Readonly<ViewCountProps>) => {
	if (type === 'DocCardServer') {
		return <FeedFirstPageViewCount bookId={bookId} docId={docId} />;
	}

	if (type === 'DocPage') {
		return <DocPageViewCount docId={docId} />;
	}

	return <span>{viewCount}</span>;
};

function DocPageViewCount({ docId }: { docId: DocEntity['id'] }) {
	const { data } = useGetPublishedDocViews(docId);

	return <span>{data?.viewCount}</span>;
}

function FeedFirstPageViewCount({
	docId,
	bookId
}: {
	docId: DocEntity['id'];
	bookId?: BookEntity['id'];
}) {
	const { data } = useGetPublishedDocsViews({
		bookId,
		page: 1,
		pageSize: CARD_LIST_PAGE_SIZE
	});

	const doc = data?.find((doc) => doc.id === docId);

	return <span>{doc?.viewCount}</span>;
}
