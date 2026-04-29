import { NotraEditor } from '@/components/notra-editor';

export const generateStaticParams = async () => {
	return [];
};

export default async function Page({
	params
}: Readonly<PageProps<'/demo/[bookId]/[docId]'>>) {
	const { docId } = await params;

	return (
		<main className="flex min-h-[calc(100dvh-3.5rem)] flex-col">
			<NotraEditor docId={Number(docId)} />
		</main>
	);
}
