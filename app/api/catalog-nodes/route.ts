import { NextRequest } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import CatalogNodeService from '@/services/catalog-node';

export async function GET(request: NextRequest) {
	const session = await auth();

	if (!session) {
		const t = getTranslations('app_api');

		return ServiceResult.fail(t.unauthorized).nextResponse({
			status: 401
		});
	}

	const { searchParams } = new URL(request.url);
	const bookId = searchParams.get('book_id');
	const nodes = await CatalogNodeService.getCatalogNodes(Number(bookId));

	return nodes.nextResponse();
}
