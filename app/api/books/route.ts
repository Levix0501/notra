import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import BookService from '@/services/book';

export async function GET(request: Request) {
	const session = await auth();

	if (!session) {
		const t = getTranslations('app_api');

		return ServiceResult.fail(t.unauthorized).nextResponse({
			status: 401
		});
	}

	const { searchParams } = new URL(request.url);
	const bookId = searchParams.get('book_id');

	if (bookId) {
		const result = await BookService.getBook(Number(bookId));

		return result.nextResponse();
	}

	const result = await BookService.getBooks();

	return result.nextResponse();
}
