import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import { CommentService } from '@/src/services/comment.service';

export async function DELETE(
	_: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = await auth();

	if (!session) {
		const t = getTranslations('app_api');

		return ServiceResult.fail(t.unauthorized).nextResponse({
			status: 401
		});
	}

	const { id } = await params;
	const commentId = Number(id);

	if (!Number.isInteger(commentId) || commentId <= 0) {
		return ServiceResult.fail('Invalid comment id.').nextResponse({
			status: 400
		});
	}

	const result = await CommentService.deleteComment(commentId);

	return result.nextResponse({
		status: result.success ? 200 : 400
	});
}
