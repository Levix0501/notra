import { Metadata } from 'next';

import DocSettingsButton from '@/components/doc-settings-button';
import HeaderEditableTitle from '@/components/header-editable-title';
import NotraEditor from '@/components/notra-editor';
import { NotraInsetHeader } from '@/components/notra-sidebar';
import { PublishButton } from '@/components/publish-button';

interface PageProps {
	params: Promise<{
		bookId: string;
		docId: string;
	}>;
}

export const generateMetadata = async ({
	params
}: Readonly<PageProps>): Promise<Metadata> => {
	const { docId } = await params;

	return {
		title: docId
	};
};

export const generateStaticParams = async () => {
	return [];
};

export default async function Page({ params }: Readonly<PageProps>) {
	const { docId } = await params;

	return (
		<>
			<NotraInsetHeader>
				<div className="flex size-full items-center justify-between">
					<HeaderEditableTitle />
					<div className="flex items-center">
						<DocSettingsButton />
						<PublishButton />
					</div>
				</div>
			</NotraInsetHeader>

			<main className="flex min-h-[calc(100dvh-3.5rem)] flex-col">
				<NotraEditor docId={Number(docId)} />
			</main>
		</>
	);
}
