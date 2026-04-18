import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { isAdminSession } from '@/lib/auth/is-admin';
import { ServiceResult } from '@/lib/service-result';
import { CommentService } from '@/src/services/comment.service';

export async function GET(request: Request) {
	const session = await auth();

	if (!session) {
		const t = getTranslations('app_api');

		return ServiceResult.fail(t.unauthorized).nextResponse({
			status: 401
		});
	}

	if (!isAdminSession(session)) {
		const t = getTranslations('app_api');

		return ServiceResult.fail(t.forbidden).nextResponse({
			status: 403
		});
	}

	const { searchParams } = new URL(request.url);
	const rawStatus = searchParams.get('status');
	const status =
		rawStatus === 'pending' || rawStatus === 'approved' ? rawStatus : 'all';

	const result = await CommentService.getAdminComments(status);

	return result.nextResponse({
		status: result.success ? 200 : 400
	});
}
