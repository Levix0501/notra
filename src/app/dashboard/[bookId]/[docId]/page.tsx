import { Metadata } from 'next';

import { NotraEditor } from '@/components/notra-editor';

export const generateMetadata = async ({
	params
}: Readonly<PageProps<'/dashboard/[bookId]/[docId]'>>): Promise<Metadata> => {
	const { docId } = await params;

	return {
		title: docId
	};
};

export const generateStaticParams = async () => {
	return [];
};

export default async function Page({
	params
}: Readonly<PageProps<'/dashboard/[bookId]/[docId]'>>) {
	const { docId } = await params;

	return (
		<main className="flex min-h-[calc(100dvh-3.5rem)] flex-col">
			<NotraEditor docId={Number(docId)} />
		</main>
	);
}
