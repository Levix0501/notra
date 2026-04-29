export const generateStaticParams = async () => {
	return [];
};

export default function Layout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="min-h-[calc(100dvh-3.5rem)]">{children}</div>;
}
