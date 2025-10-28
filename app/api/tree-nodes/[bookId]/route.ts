import { NextRequest } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
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

	const { bookId } = await params;
	const nodes = await TreeNodeService.getTreeNodesByBookId(Number(bookId));

	return nodes.nextResponse();
}
