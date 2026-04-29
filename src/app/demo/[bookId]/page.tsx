import { DemoBookPage } from '@/components/demo-book-page';

export default async function Page({
	params
}: Readonly<PageProps<'/demo/[bookId]'>>) {
	const { bookId } = await params;

	return <DemoBookPage bookId={Number(bookId)} />;
}
