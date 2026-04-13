'use client';

import { toast } from 'sonner';

import { useGetComments } from '@/queries/comment';

import { CommentForm } from './comment-form';
import { CommentFormPayload, CommentItem } from './comment-item';

type CommentsSectionProps = {
	docId: number;
	isAdmin?: boolean;
};

async function requestJson(
	path: string,
	init: RequestInit = {}
): Promise<{ success: boolean; message: string }> {
	const response = await fetch(path, {
		...init,
		headers: {
			'content-type': 'application/json',
			...(init.headers || {})
		}
	});
	const result = (await response.json()) as {
		success: boolean;
		message: string;
	};

	if (!response.ok || !result.success) {
		throw new Error(result.message || 'Request failed.');
	}

	return result;
}

export function CommentsSection({
	docId,
	isAdmin = false
}: CommentsSectionProps) {
	const {
		data: comments = [],
		isLoading,
		error,
		mutate
	} = useGetComments(docId);

	const createComment = async (values: CommentFormPayload) => {
		await requestJson(`/api/docs/${docId}/comments`, {
			method: 'POST',
			body: JSON.stringify(values)
		});
		toast.success('Comment submitted.');
		await mutate();
	};

	const replyToComment = async (
		parentId: number,
		values: CommentFormPayload
	) => {
		await requestJson(`/api/comments/${parentId}/reply`, {
			method: 'POST',
			body: JSON.stringify(values)
		});
		toast.success('Reply submitted.');
		await mutate();
	};

	const approveComment = async (id: number) => {
		await requestJson(`/api/comments/${id}/approve`, { method: 'PATCH' });
		toast.success('Comment approved.');
		await mutate();
	};

	const deleteComment = async (id: number) => {
		await requestJson(`/api/comments/${id}`, { method: 'DELETE' });
		toast.success('Comment deleted.');
		await mutate();
	};

	return (
		<section className="mt-10 space-y-6 border-t pt-8">
			<h2 className="text-xl font-semibold">Comments ({comments.length})</h2>

			<CommentForm onSubmit={createComment} />

			{isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
			{error && (
				<p className="text-sm text-destructive">Failed to load comments.</p>
			)}
			{!isLoading && !error && comments.length === 0 && (
				<p className="text-sm text-muted-foreground">
					No comments yet. Be the first to comment.
				</p>
			)}

			<div className="space-y-4">
				{comments.map((comment) => (
					<CommentItem
						key={comment.id}
						comment={comment}
						isAdmin={isAdmin}
						onApprove={approveComment}
						onDelete={deleteComment}
						onReply={replyToComment}
					/>
				))}
			</div>
		</section>
	);
}
