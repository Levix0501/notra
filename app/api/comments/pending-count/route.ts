import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import { CommentService } from '@/src/services/comment.service';

export async function GET() {
	const session = await auth();

	if (!session) {
		const t = getTranslations('app_api');

		return ServiceResult.fail(t.unauthorized).nextResponse({
			status: 401
		});
	}

	const result = await CommentService.getPendingCount();

	return result.nextResponse({
		status: result.success ? 200 : 400
	});
}
