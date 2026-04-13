import { CommentEntity, DocEntity } from '@prisma/client';

import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { CommentWithReplies, CreateCommentDto } from '@/types/comment';

import { CreateCommentSchema } from '../lib/validations/comment';

const BAD_WORDS = ['spam', 'scam', 'casino', 'viagra', 'xxx'];
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const rateLimitStore = new Map<string, number[]>();
const isDemoMode = process.env.NEXT_PUBLIC_DEMO === 'true';

function containsBadWords(content: string): boolean {
	const normalized = content.toLowerCase();

	return BAD_WORDS.some((word) => normalized.includes(word));
}

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const windowStart = now - RATE_LIMIT_WINDOW_MS;
	const requestTimestamps = rateLimitStore.get(ip) ?? [];
	const recentRequests = requestTimestamps.filter(
		(timestamp) => timestamp > windowStart
	);

	if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
		rateLimitStore.set(ip, recentRequests);

		return true;
	}

	rateLimitStore.set(ip, [...recentRequests, now]);

	return false;
}

function toCommentTree(comments: CommentEntity[]): CommentWithReplies[] {
	const byId = new Map<number, CommentWithReplies>();
	const roots: CommentWithReplies[] = [];

	for (const comment of comments) {
		byId.set(comment.id, { ...comment, replies: [] });
	}

	for (const comment of comments) {
		const node = byId.get(comment.id);

		if (!node) {
			continue;
		}

		if (comment.parentId) {
			const parent = byId.get(comment.parentId);

			if (parent) {
				parent.replies = [...(parent.replies || []), node];
				continue;
			}
		}

		roots.push(node);
	}

	return roots;
}

function sendReplyNotification(parent: CommentEntity, reply: CommentEntity) {
	console.info('sendReplyNotification', {
		parentCommentId: parent.id,
		parentAuthorEmail: parent.authorEmail,
		replyCommentId: reply.id
	});
}

export class CommentService {
	static async getAdminComments(
		status: 'all' | 'pending' | 'approved' = 'all'
	) {
		try {
			const comments = await prisma.commentEntity.findMany({
				where:
					status === 'all'
						? void 0
						: {
								isApproved: status === 'approved'
							},
				orderBy: {
					createdAt: 'desc'
				},
				include: {
					doc: {
						select: {
							id: true,
							title: true,
							slug: true
						}
					}
				}
			});

			return ServiceResult.success(comments);
		} catch (error) {
			logger('CommentService.getAdminComments', error);

			return ServiceResult.fail('Failed to load admin comments.');
		}
	}

	static async getComments(docId: DocEntity['id']) {
		try {
			const comments = await prisma.commentEntity.findMany({
				where: {
					docId,
					isApproved: true
				},
				orderBy: {
					createdAt: 'asc'
				}
			});

			return ServiceResult.success(toCommentTree(comments));
		} catch (error) {
			logger('CommentService.getComments', error);

			return ServiceResult.fail('Failed to load comments.');
		}
	}

	static async createComment(
		docId: DocEntity['id'],
		input: CreateCommentDto,
		clientIp?: string
	) {
		const parsed = CreateCommentSchema.safeParse(input);

		if (!parsed.success) {
			return ServiceResult.fail('Invalid comment payload.');
		}

		if (parsed.data.honeypot && parsed.data.honeypot.trim().length > 0) {
			return ServiceResult.fail('Spam detected.');
		}

		if (containsBadWords(parsed.data.content)) {
			return ServiceResult.fail('Comment contains prohibited content.');
		}

		if (clientIp && isRateLimited(clientIp)) {
			return ServiceResult.fail('Too many comments. Please try again later.');
		}

		try {
			let parent: CommentEntity | null = null;

			if (parsed.data.parentId) {
				parent = await prisma.commentEntity.findFirst({
					where: {
						id: parsed.data.parentId,
						docId
					}
				});

				if (!parent) {
					return ServiceResult.fail('Parent comment not found.');
				}
			}

			const comment = await prisma.commentEntity.create({
				data: {
					docId,
					parentId: parsed.data.parentId ?? null,
					content: parsed.data.content.trim(),
					authorName: parsed.data.authorName.trim(),
					authorEmail: parsed.data.authorEmail.trim().toLowerCase(),
					authorWebsite:
						parsed.data.authorWebsite?.trim() !== ''
							? parsed.data.authorWebsite?.trim()
							: null,
					honeypot: parsed.data.honeypot?.trim() || null,
					isApproved: isDemoMode
				}
			});

			if (parent) {
				sendReplyNotification(parent, comment);
			}

			return ServiceResult.success(
				comment,
				'Comment submitted and waiting for moderation.'
			);
		} catch (error) {
			logger('CommentService.createComment', error);

			return ServiceResult.fail('Failed to create comment.');
		}
	}

	static async approveComment(id: CommentEntity['id']) {
		try {
			const comment = await prisma.commentEntity.update({
				where: { id },
				data: {
					isApproved: true
				}
			});

			return ServiceResult.success(comment);
		} catch (error) {
			logger('CommentService.approveComment', error);

			return ServiceResult.fail('Failed to approve comment.');
		}
	}

	static async deleteComment(id: CommentEntity['id']) {
		try {
			await prisma.commentEntity.delete({
				where: { id }
			});

			return ServiceResult.success(true);
		} catch (error) {
			logger('CommentService.deleteComment', error);

			return ServiceResult.fail('Failed to delete comment.');
		}
	}
}
