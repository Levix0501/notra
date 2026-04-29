import { DocService } from '@/services/doc';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const bookId = searchParams.get('book_id');
	const page = searchParams.get('page');
	const pageSize = searchParams.get('page_size');

	const result = await DocService.getPublishedBlogs({
		bookId: bookId ? Number(bookId) : void 0,
		page: Number(page),
		pageSize: Number(pageSize)
	});

	return result.nextResponse();
}
