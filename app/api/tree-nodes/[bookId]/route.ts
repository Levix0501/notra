import { NextRequest } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { parseBookId } from '@/lib/book-id';
import { ServiceResult } from '@/lib/service-result';
import { TreeNodeService } from '@/services/tree-node';

export async function GET(
	_: NextRequest,
	{ params }: { params: Promise<{ bookId: string }> }
) {
	const session = await auth();

	if (!session) {
		const t = getTranslations('app_api');

		return ServiceResult.fail(t.unauthorized).nextResponse({
			status: 401
		});
	}

	const { bookId: rawBookId } = await params;
	const bookId = parseBookId(rawBookId);

	if (bookId === null) {
		return ServiceResult.success([]).nextResponse();
	}

	const nodes = await TreeNodeService.getTreeNodesByBookId(bookId);

	return nodes.nextResponse();
}
