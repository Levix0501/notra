import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authMock, commentServiceMock, prismaMock } = vi.hoisted(() => ({
	authMock: vi.fn(),
	commentServiceMock: {
		getComments: vi.fn(),
		createComment: vi.fn(),
		getAdminComments: vi.fn(),
		getPendingCount: vi.fn(),
		bulkApprove: vi.fn(),
		bulkDelete: vi.fn(),
		approveComment: vi.fn(),
		deleteComment: vi.fn()
	},
	prismaMock: {
		commentEntity: {
			findUnique: vi.fn()
		}
	}
}));

vi.mock('@/app/(auth)/auth', () => ({
	auth: authMock
}));

vi.mock('@/src/services/comment.service', () => ({
	CommentService: commentServiceMock
}));

vi.mock('@/lib/prisma', () => ({
	default: prismaMock
}));

import * as ApproveRoute from '@/app/api/comments/[id]/approve/route';
import * as ReplyRoute from '@/app/api/comments/[id]/reply/route';
import * as CommentRoute from '@/app/api/comments/[id]/route';
import * as BulkRoute from '@/app/api/comments/bulk/route';
import * as PendingCountRoute from '@/app/api/comments/pending-count/route';
import * as AdminCommentsRoute from '@/app/api/comments/route';
import * as DocCommentsRoute from '@/app/api/docs/[id]/comments/route';

describe('Comment API routes (Step 4)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('GET /api/docs/[id]/comments returns comments', async () => {
		commentServiceMock.getComments.mockResolvedValue({
			nextResponse: vi
				.fn()
				.mockResolvedValue(new Response('ok', { status: 200 }))
		});

		const response = await DocCommentsRoute.GET(
			new Request('http://localhost'),
			{
				params: Promise.resolve({ id: '10' })
			}
		);

		expect(commentServiceMock.getComments).toHaveBeenCalledWith(10);
		expect(response.status).toBe(200);
	});

	it('POST /api/docs/[id]/comments forwards payload and client ip', async () => {
		commentServiceMock.createComment.mockResolvedValue({
			success: true,
			message: '',
			nextResponse: vi
				.fn()
				.mockResolvedValue(new Response('created', { status: 201 }))
		});

		const request = new Request('http://localhost', {
			method: 'POST',
			headers: {
				'x-forwarded-for': '203.0.113.10, 127.0.0.1',
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				content: 'Hello',
				authorName: 'Alice',
				authorEmail: 'alice@example.com'
			})
		});

		const response = await DocCommentsRoute.POST(request, {
			params: Promise.resolve({ id: '10' })
		});

		expect(commentServiceMock.createComment).toHaveBeenCalledWith(
			10,
			expect.objectContaining({
				content: 'Hello'
			}),
			'203.0.113.10'
		);
		expect(response.status).toBe(201);
	});

	it('POST /api/comments/[id]/reply resolves parent doc id', async () => {
		prismaMock.commentEntity.findUnique.mockResolvedValue({
			id: 11,
			docId: 99
		});
		commentServiceMock.createComment.mockResolvedValue({
			success: true,
			nextResponse: vi
				.fn()
				.mockResolvedValue(new Response('created', { status: 201 }))
		});

		const request = new Request('http://localhost', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				content: 'Reply',
				authorName: 'Bob',
				authorEmail: 'bob@example.com'
			})
		});

		const response = await ReplyRoute.POST(request, {
			params: Promise.resolve({ id: '11' })
		});

		expect(prismaMock.commentEntity.findUnique).toHaveBeenCalledWith({
			where: { id: 11 },
			select: { id: true, docId: true }
		});
		expect(commentServiceMock.createComment).toHaveBeenCalledWith(
			99,
			expect.objectContaining({ parentId: 11 }),
			undefined
		);
		expect(response.status).toBe(201);
	});

	it('admin routes return 401 without session', async () => {
		authMock.mockResolvedValue(null);

		const approveResponse = await ApproveRoute.PATCH(
			new Request('http://localhost'),
			{
				params: Promise.resolve({ id: '1' })
			}
		);
		const deleteResponse = await CommentRoute.DELETE(
			new Request('http://localhost'),
			{
				params: Promise.resolve({ id: '1' })
			}
		);

		expect(approveResponse.status).toBe(401);
		expect(deleteResponse.status).toBe(401);
	});

	it('admin routes call service when session exists', async () => {
		authMock.mockResolvedValue({ user: { id: 'admin', role: 'ADMIN' } });
		commentServiceMock.approveComment.mockResolvedValue({
			success: true,
			nextResponse: vi
				.fn()
				.mockResolvedValue(new Response('ok', { status: 200 }))
		});
		commentServiceMock.deleteComment.mockResolvedValue({
			success: true,
			nextResponse: vi
				.fn()
				.mockResolvedValue(new Response('ok', { status: 200 }))
		});

		const approveResponse = await ApproveRoute.PATCH(
			new Request('http://localhost'),
			{
				params: Promise.resolve({ id: '15' })
			}
		);
		const deleteResponse = await CommentRoute.DELETE(
			new Request('http://localhost'),
			{
				params: Promise.resolve({ id: '15' })
			}
		);

		expect(commentServiceMock.approveComment).toHaveBeenCalledWith(15);
		expect(commentServiceMock.deleteComment).toHaveBeenCalledWith(15);
		expect(approveResponse.status).toBe(200);
		expect(deleteResponse.status).toBe(200);
	});

	it('admin routes return 403 for non-admin role', async () => {
		authMock.mockResolvedValue({ user: { id: 'u1', role: 'USER' } });

		const approveResponse = await ApproveRoute.PATCH(
			new Request('http://localhost'),
			{
				params: Promise.resolve({ id: '1' })
			}
		);
		const deleteResponse = await CommentRoute.DELETE(
			new Request('http://localhost'),
			{
				params: Promise.resolve({ id: '1' })
			}
		);

		expect(approveResponse.status).toBe(403);
		expect(deleteResponse.status).toBe(403);
	});

	it('demo mode keeps service approval behavior unchanged', async () => {
		vi.stubEnv('NEXT_PUBLIC_DEMO', 'true');
		commentServiceMock.createComment.mockResolvedValue({
			success: true,
			message: '',
			data: { isApproved: true },
			nextResponse: vi
				.fn()
				.mockResolvedValue(new Response('created', { status: 201 }))
		});

		const request = new Request('http://localhost', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				content: 'Demo comment',
				authorName: 'Demo',
				authorEmail: 'demo@example.com'
			})
		});

		const response = await DocCommentsRoute.POST(request, {
			params: Promise.resolve({ id: '10' })
		});

		expect(response.status).toBe(201);
		vi.unstubAllEnvs();
	});

	it('GET /api/comments/pending-count returns count for admin', async () => {
		authMock.mockResolvedValue({ user: { id: 'admin', role: 'ADMIN' } });
		commentServiceMock.getPendingCount.mockResolvedValue({
			success: true,
			nextResponse: vi
				.fn()
				.mockResolvedValue(new Response('ok', { status: 200 }))
		});

		const response = await PendingCountRoute.GET();

		expect(commentServiceMock.getPendingCount).toHaveBeenCalled();
		expect(response.status).toBe(200);
	});

	it('POST /api/comments/bulk approves selected comments', async () => {
		authMock.mockResolvedValue({ user: { id: 'admin', role: 'ADMIN' } });
		commentServiceMock.bulkApprove.mockResolvedValue({
			success: true,
			nextResponse: vi
				.fn()
				.mockResolvedValue(new Response('ok', { status: 200 }))
		});

		const response = await BulkRoute.POST(
			new Request('http://localhost', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					action: 'approve',
					ids: [1, 2, 3]
				})
			})
		);

		expect(commentServiceMock.bulkApprove).toHaveBeenCalledWith([1, 2, 3]);
		expect(response.status).toBe(200);
	});

	it('GET /api/comments filters by status', async () => {
		authMock.mockResolvedValue({ user: { id: 'admin', role: 'ADMIN' } });
		commentServiceMock.getAdminComments.mockResolvedValue({
			success: true,
			nextResponse: vi
				.fn()
				.mockResolvedValue(new Response('ok', { status: 200 }))
		});

		const response = await AdminCommentsRoute.GET(
			new Request('http://localhost/api/comments?status=pending')
		);

		expect(commentServiceMock.getAdminComments).toHaveBeenCalledWith('pending');
		expect(response.status).toBe(200);
	});
});
