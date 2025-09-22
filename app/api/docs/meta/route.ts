import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import DocService from '@/services/doc';

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
	const docId = searchParams.get('doc_id');

	if (docId) {
		const result = await DocService.getDocMeta(Number(bookId), Number(docId));

		return result.nextResponse();
	}

	const page = searchParams.get('page');
	const pageSize = searchParams.get('page_size');

	const result = await DocService.getPublishedDocMetaList({
		bookId: bookId ? Number(bookId) : void 0,
		page: Number(page),
		pageSize: Number(pageSize)
	});

	return result.nextResponse();
}
