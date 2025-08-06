import { Metadata } from 'next';

import { NotraInsetHeader } from '@/components/notra-sidebar';
import { ThemeChanger } from '@/components/theme-changer';
import BookService from '@/services/book';

export const generateMetadata = async ({
	params
}: {
	params: Promise<{ book: string }>;
}): Promise<Metadata> => {
	const { book: slug } = await params;
	const { data: book } = await BookService.getBook(slug);

	return {
		title: book?.name ?? ''
	};
};

export default function Page() {
	return (
		<>
			<NotraInsetHeader>
				<div className="flex size-full items-center justify-between">
					<span></span>

					<ThemeChanger />
				</div>
			</NotraInsetHeader>

			<main className="container mx-auto p-4 md:p-8"></main>
		</>
	);
}
