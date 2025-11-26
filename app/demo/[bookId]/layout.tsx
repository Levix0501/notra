import { DemoBookLayout } from '@/components/demo-book-layout';

export const generateStaticParams = async () => {
	return [];
};

export default async function Layout({
	children,
	params
}: Readonly<LayoutProps<'/demo/[bookId]'>>) {
	const { bookId } = await params;

	return <DemoBookLayout bookId={Number(bookId)}>{children}</DemoBookLayout>;
}
