'use client';
import { BookEntity, DocEntity } from '@prisma/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Eye } from 'lucide-react';

import {
	useGetFirstPagePublishedDocsMeta,
	useGetPublishedDocMeta
} from '@/queries/doc';
import { PublishedDocMetaVo } from '@/types/doc';

dayjs.extend(relativeTime);

type DocMetaProps =
	| {
			doc: PublishedDocMetaVo;
			type: 'DocCardClient';
	  }
	| {
			docId: DocEntity['id'];
			bookId?: BookEntity['id'];
			type: 'DocCardServer';
	  }
	| {
			docId: DocEntity['id'];
			type: 'DocPage';
	  };

export const DocMeta = (props: Readonly<DocMetaProps>) => {
	switch (props.type) {
		case 'DocCardClient':
			return (
				<Meta
					publishedAt={props.doc.publishedAt}
					viewCount={props.doc.viewCount}
				/>
			);
		case 'DocCardServer':
			return <FirstPageMeta bookId={props.bookId} docId={props.docId} />;
		case 'DocPage':
			return <DocPageMeta docId={props.docId} />;

		default:
			return null;
	}
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

function FirstPageMeta({
	docId,
	bookId
}: {
	docId: DocEntity['id'];
	bookId?: BookEntity['id'];
}) {
	const { data } = useGetFirstPagePublishedDocsMeta(bookId);

	const doc = data?.find((doc) => doc.id === docId);

	return <Meta publishedAt={doc?.publishedAt} viewCount={doc?.viewCount} />;
}

function DocPageMeta({ docId }: { docId: DocEntity['id'] }) {
	const { data } = useGetPublishedDocMeta(docId);

	return <Meta publishedAt={data?.publishedAt} viewCount={data?.viewCount} />;
}
