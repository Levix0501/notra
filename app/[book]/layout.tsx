import NotraHeader from '@/components/notra-header';

export const generateStaticParams = async () => {
	return [];
};

export default function Layout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-dvh flex-col">
			<NotraHeader />

			<main className="container mx-auto flex-1">{children}</main>
		</div>
	);
}
