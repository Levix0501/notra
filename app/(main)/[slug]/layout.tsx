export const generateStaticParams = async () => {
	return [];
};

export default function Layout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
