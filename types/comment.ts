import { CommentEntity } from '@prisma/client';

export type CreateCommentDto = {
	content: string;
	authorName: string;
	authorEmail: string;
	authorWebsite?: string;
	honeypot?: string;
	parentId?: number;
};

export type CommentWithReplies = Omit<CommentEntity, 'honeypot'> & {
	replies?: CommentWithReplies[];
};

export type PaginatedComments = {
	items: CommentWithReplies[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
};
