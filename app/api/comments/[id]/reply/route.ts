import prisma from '@/lib/prisma';
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

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	const parentId = Number(id);

	if (!Number.isInteger(parentId) || parentId <= 0) {
		return ServiceResult.fail('Invalid comment id.').nextResponse({
			status: 400
		});
	}

	const parent = await prisma.commentEntity.findUnique({
		where: { id: parentId },
		select: { id: true, docId: true }
	});

	if (!parent) {
		return ServiceResult.fail('Parent comment not found.').nextResponse({
			status: 404
		});
	}

	const body = (await request.json()) as CreateCommentDto;
	const result = await CommentService.createComment(
		parent.docId,
		{
			...body,
			parentId
		},
		getClientIp(request)
	);

	return result.nextResponse({
		status: result.success ? 201 : 400
	});
}
