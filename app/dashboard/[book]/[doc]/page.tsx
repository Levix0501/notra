import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import DocSettingsButton from '@/components/doc-settings-button';
import DocStoreProvider from '@/components/doc-store-provider';
import HeaderEditableTitle from '@/components/header-editable-title';
import { NotraInsetHeader } from '@/components/notra-sidebar';
import DocService from '@/services/doc';

interface PageProps {
	params: Promise<{
		book: string;
		doc: string;
	}>;
}

export const generateMetadata = async ({
	params
}: Readonly<PageProps>): Promise<Metadata> => {
	const { book: bookSlug, doc: docSlug } = await params;
	const { data: doc } = await DocService.getDoc(bookSlug, docSlug);

	return {
		title: doc?.title
	};
};

export default async function Page({ params }: Readonly<PageProps>) {
	const { book: bookSlug, doc: docSlug } = await params;
	const { data: doc } = await DocService.getDoc(bookSlug, docSlug);

	if (!doc) {
		notFound();
	}

	return (
		<>
			<NotraInsetHeader>
				<div className="flex size-full items-center justify-between">
					<HeaderEditableTitle />
					<DocSettingsButton />
				</div>
			</NotraInsetHeader>

			<main className="container mx-auto p-4 md:p-8">doc page</main>

			<DocStoreProvider id={doc.id} slug={doc.slug} />
		</>
	);
}
