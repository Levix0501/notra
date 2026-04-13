import { CommentEntity } from '@prisma/client';

import prisma from '@/lib/prisma';

interface INotificationService {
	sendReplyEmailMock(comment: CommentEntity): Promise<void>;
}

class MockNotificationService implements INotificationService {
	async sendReplyEmailMock(comment: CommentEntity): Promise<void> {
		if (!comment.parentId) {
			return;
		}

		const parentComment = await prisma.commentEntity.findUnique({
			where: { id: comment.parentId },
			select: {
				id: true,
				authorEmail: true
			}
		});

		if (!parentComment) {
			return;
		}

		console.info('sendReplyEmailMock', {
			parentCommentId: parentComment.id,
			to: parentComment.authorEmail,
			replyCommentId: comment.id
		});
	}
}

export const NotificationService: INotificationService = new MockNotificationService();
