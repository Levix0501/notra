import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import DocSettingsButton from '@/components/doc-settings-button';
import DocStoreProvider from '@/components/doc-store-provider';
import HeaderEditableTitle from '@/components/header-editable-title';
import { NotraInsetHeader } from '@/components/notra-sidebar';
import DocService from '@/services/doc';

interface PageProps {
	params: Promise<{
		doc: string;
	}>;
}

export const generateMetadata = async ({
	params
}: Readonly<PageProps>): Promise<Metadata> => {
	const { doc: slug } = await params;
	const { data: doc } = await DocService.getDoc(slug);

	return {
		title: doc?.title
	};
};

export default async function Page({ params }: Readonly<PageProps>) {
	const { doc: slug } = await params;
	const { data: doc } = await DocService.getDoc(slug);

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

			<DocStoreProvider id={doc.id} slug={slug} />
		</>
	);
}
