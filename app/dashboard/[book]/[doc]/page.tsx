import { Metadata } from 'next';

import DocSettingsButton from '@/components/doc-settings-button';
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
	const { doc } = await params;

	return {
		title: doc
	};
};

export const generateStaticParams = async ({ params }: Readonly<PageProps>) => {
	const { book } = await params;

	const { data: docs } = await DocService.getDocsByBookSlug(book);

	return (
		docs?.map((doc) => ({
			doc: doc.slug
		})) ?? []
	);
};

export default async function Page() {
	return (
		<>
			<NotraInsetHeader>
				<div className="flex size-full items-center justify-between">
					<HeaderEditableTitle />
					<DocSettingsButton />
				</div>
			</NotraInsetHeader>

			<main className="container mx-auto p-4 md:p-8">doc page</main>
		</>
	);
}
