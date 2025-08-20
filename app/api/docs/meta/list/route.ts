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
	const bookSlug = searchParams.get('book_slug');
	const page = Number(searchParams.get('page') ?? 1);
	const pageSize = Number(searchParams.get('page_size') ?? 12);

	const result = await DocService.getPublishedDocMetaList({
		bookSlug,
		page,
		pageSize
	});

	return result.nextResponse();
}
