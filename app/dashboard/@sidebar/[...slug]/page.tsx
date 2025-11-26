import { BookCatalog } from '@/components/book-catalog';
import { BookName } from '@/components/book-name';
import { BookSettingsButton } from '@/components/book-settings-button';
import { BooksDropdown } from '@/components/books-dropdown';

export default async function Default({
	params
}: Readonly<PageProps<'/dashboard/[...slug]'>>) {
	const { slug } = await params;
	const bookId = Number(slug[0]);

	return (
		<>
			<div className="mb-4 flex items-center justify-between px-5 md:px-3.5">
				<div className="flex items-center gap-1">
					<BookName bookId={bookId} />
					<BooksDropdown bookId={bookId} />
				</div>
				<BookSettingsButton bookId={bookId} />
			</div>

			<div className="flex-1 overflow-hidden">
				<BookCatalog bookId={bookId} />
			</div>
		</>
	);
}
