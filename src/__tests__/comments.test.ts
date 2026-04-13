import { CommentEntity } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateCommentSchema } from '@/src/lib/validations/comment';
import { CommentService } from '@/src/services/comment.service';

const { prismaMock } = vi.hoisted(() => ({
	prismaMock: {
		commentEntity: {
			findMany: vi.fn(),
			findFirst: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn()
		}
	}
}));

vi.mock('@/lib/prisma', () => ({
	default: prismaMock
}));

vi.mock('@/lib/logger', () => ({
	logger: vi.fn()
}));

function makeComment(partial: Partial<CommentEntity> = {}): CommentEntity {
	const now = new Date('2026-04-13T00:00:00.000Z');

	return {
		id: 1,
		content: 'Test comment',
		authorName: 'Alice',
		authorEmail: 'alice@example.com',
		authorWebsite: null,
		isApproved: true,
		honeypot: null,
		parentId: null,
		docId: 10,
		createdAt: now,
		updatedAt: now,
		...partial
	};
}

describe('Comment validation (Step 2)', () => {
	it('accepts parentId as null', () => {
		const result = CreateCommentSchema.safeParse({
			content: 'Valid content',
			authorName: 'User',
			authorEmail: 'user@example.com',
			parentId: null
		});

		expect(result.success).toBe(true);
	});

	it('rejects non-empty honeypot', () => {
		const result = CreateCommentSchema.safeParse({
			content: 'Valid content',
			authorName: 'User',
			authorEmail: 'user@example.com',
			honeypot: 'bot-field'
		});

		expect(result.success).toBe(false);
	});
});

describe('Comment service (Step 3)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('builds deep nested tree without explicit depth limit', async () => {
		prismaMock.commentEntity.findMany.mockResolvedValue([
			makeComment({ id: 1, parentId: null, content: 'root' }),
			makeComment({ id: 2, parentId: 1, content: 'level-1' }),
			makeComment({ id: 3, parentId: 2, content: 'level-2' }),
			makeComment({ id: 4, parentId: 3, content: 'level-3' })
		]);

		const result = await CommentService.getComments(10);

		expect(result.success).toBe(true);

		if (!result.data) {
			throw new Error('Expected comments tree data');
		}

		const data = result.data;

		expect(data).toHaveLength(1);
		expect(data[0].replies?.[0].id).toBe(2);
		expect(data[0].replies?.[0].replies?.[0].id).toBe(3);
		expect(data[0].replies?.[0].replies?.[0].replies?.[0].id).toBe(4);
	});

	it('creates comment with isApproved false by default', async () => {
		prismaMock.commentEntity.create.mockResolvedValue(
			makeComment({ id: 11, isApproved: false })
		);

		const result = await CommentService.createComment(
			10,
			{
				content: '  New comment  ',
				authorName: '  Alice  ',
				authorEmail: 'Alice@Example.com'
			},
			'192.168.0.10'
		);

		expect(result.success).toBe(true);
		expect(prismaMock.commentEntity.create).toHaveBeenCalledWith({
			data: expect.objectContaining({
				docId: 10,
				isApproved: false,
				parentId: null,
				content: 'New comment',
				authorName: 'Alice',
				authorEmail: 'alice@example.com'
			})
		});
	});

	it('rejects comments with bad words', async () => {
		const result = await CommentService.createComment(10, {
			content: 'This looks like casino spam',
			authorName: 'Alice',
			authorEmail: 'alice@example.com'
		});

		expect(result.success).toBe(false);
		expect(result.message).toBe('Comment contains prohibited content.');
		expect(prismaMock.commentEntity.create).not.toHaveBeenCalled();
	});

	it('rejects comments when honeypot is filled', async () => {
		const result = await CommentService.createComment(10, {
			content: 'Legit content',
			authorName: 'Alice',
			authorEmail: 'alice@example.com',
			honeypot: 'filled-by-bot'
		});

		expect(result.success).toBe(false);
		expect(result.message).toBe('Invalid comment payload.');
		expect(prismaMock.commentEntity.create).not.toHaveBeenCalled();
	});

	it('enforces rate limit (5 comments per 10 minutes per IP)', async () => {
		prismaMock.commentEntity.create.mockResolvedValue(
			makeComment({ id: 50, isApproved: false })
		);

		for (let i = 0; i < 5; i++) {
			const result = await CommentService.createComment(
				10,
				{
					content: `Allowed comment ${i + 1}`,
					authorName: 'Alice',
					authorEmail: 'alice@example.com'
				},
				'203.0.113.77'
			);

			expect(result.success).toBe(true);
		}

		const blocked = await CommentService.createComment(
			10,
			{
				content: 'Blocked comment',
				authorName: 'Alice',
				authorEmail: 'alice@example.com'
			},
			'203.0.113.77'
		);

		expect(blocked.success).toBe(false);
		expect(blocked.message).toBe('Too many comments. Please try again later.');
	});

	it('fails reply when parent comment does not exist', async () => {
		prismaMock.commentEntity.findFirst.mockResolvedValue(null);

		const result = await CommentService.createComment(10, {
			content: 'Reply',
			authorName: 'Alice',
			authorEmail: 'alice@example.com',
			parentId: 999
		});

		expect(result.success).toBe(false);
		expect(result.message).toBe('Parent comment not found.');
	});

	it('approves and deletes comments via moderation methods', async () => {
		prismaMock.commentEntity.update.mockResolvedValue(
			makeComment({ id: 77, isApproved: true })
		);
		prismaMock.commentEntity.delete.mockResolvedValue(makeComment({ id: 77 }));

		const approveResult = await CommentService.approveComment(77);
		const deleteResult = await CommentService.deleteComment(77);

		expect(approveResult.success).toBe(true);

		if (!approveResult.data) {
			throw new Error('Expected approved comment data');
		}

		expect(approveResult.data.isApproved).toBe(true);
		expect(deleteResult.success).toBe(true);
		expect(deleteResult.data).toBe(true);
	});
});
