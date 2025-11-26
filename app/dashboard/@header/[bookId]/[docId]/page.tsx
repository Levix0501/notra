import { DocPublishButton } from '@/components/doc-publish-button';
import { HeaderEditableTitle } from '@/components/header-editable-title';
import { NotraInsetHeader } from '@/components/notra-sidebar';

export const generateStaticParams = async () => {
	return [];
};

export default async function Page({
	params
}: Readonly<PageProps<'/dashboard/[bookId]/[docId]'>>) {
	const { bookId } = await params;

	return (
		<NotraInsetHeader>
			<div className="flex size-full items-center justify-between">
				<HeaderEditableTitle />
				<div className="flex items-center">
					<DocPublishButton bookId={Number(bookId)} />
				</div>
			</div>
		</NotraInsetHeader>
	);
}
