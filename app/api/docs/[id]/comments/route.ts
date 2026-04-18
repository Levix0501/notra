import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import { CommentService } from '@/src/services/comment.service';
import { CreateCommentDto } from '@/types/comment';

function getClientIp(request: Request): string | undefined {
	const forwardedFor = request.headers.get('x-forwarded-for');
	const realIp = request.headers.get('x-real-ip');

	if (forwardedFor) {
		return forwardedFor.split(',')[0].trim();
	}

	return realIp ?? undefined;
}

export async function GET(
	_: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	const docId = Number(id);

	if (!Number.isInteger(docId) || docId <= 0) {
		return ServiceResult.fail('Invalid doc id.').nextResponse({
			status: 400
		});
	}

	const result = await CommentService.getComments(docId);

	return result.nextResponse();
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	const docId = Number(id);

	if (!Number.isInteger(docId) || docId <= 0) {
		return ServiceResult.fail('Invalid doc id.').nextResponse({
			status: 400
		});
	}

	const body = (await request.json()) as CreateCommentDto;
	const result = await CommentService.createComment(
		docId,
		body,
		getClientIp(request)
	);

	const t = getTranslations('app_api');
	const status = result.success
		? 201
		: result.message === t.unauthorized
			? 401
			: 400;

	return result.nextResponse({ status });
}
