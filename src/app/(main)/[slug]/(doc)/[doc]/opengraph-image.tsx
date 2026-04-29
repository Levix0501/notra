import { ImageResponse } from 'next/og';

import { DocService } from '@/services/doc';

interface PageProps {
	params: Promise<{
		slug: string;
		doc: string;
	}>;
}

export default async function Image({ params }: Readonly<PageProps>) {
	const { slug: bookSlug, doc: docSlug } = await params;
	const { data: doc } = await DocService.getPublishedDoc(bookSlug, docSlug);

	return new ImageResponse(
		<div
			style={{
				fontSize: 128,
				background: 'white',
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			{doc?.title}
		</div>
	);
}
