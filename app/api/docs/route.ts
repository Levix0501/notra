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
	const result = await DocService.getDoc(Number(bookId), Number(docId));

	return result.nextResponse();
}
