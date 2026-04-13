import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import { CommentService } from '@/src/services/comment.service';

type BulkAction = 'approve' | 'delete';

type BulkPayload = {
	action: BulkAction;
	ids: number[];
};

export async function POST(request: Request) {
	const session = await auth();

	if (!session) {
		const t = getTranslations('app_api');

		return ServiceResult.fail(t.unauthorized).nextResponse({
			status: 401
		});
	}

	const payload = (await request.json()) as BulkPayload;
	const ids = payload.ids.filter((id) => Number.isInteger(id) && id > 0);

	if (ids.length === 0) {
		return ServiceResult.fail('No valid comment ids provided.').nextResponse({
			status: 400
		});
	}

	if (payload.action === 'approve') {
		const result = await CommentService.bulkApprove(ids);

		return result.nextResponse({
			status: result.success ? 200 : 400
		});
	}

	if (payload.action === 'delete') {
		const result = await CommentService.bulkDelete(ids);

		return result.nextResponse({
			status: result.success ? 200 : 400
		});
	}

	return ServiceResult.fail('Invalid bulk action.').nextResponse({
		status: 400
	});
}
