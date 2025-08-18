import NotraHeader from '@/components/notra-header';
import BookService from '@/services/book';

export const generateStaticParams = async () => {
	const { data: books } = await BookService.getBooks();

	return books?.map((book) => ({ book: book.slug })) ?? [];
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
