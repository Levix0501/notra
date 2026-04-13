'use client';

import { toast } from 'sonner';

import { useApp } from '@/contexts/app-context';
import { getTranslations } from '@/i18n';
import { useGetComments } from '@/queries/comment';
import { DemoService } from '@/services/demo';

import { CommentForm } from './comment-form';
import { CommentFormPayload, CommentItem } from './comment-item';

type CommentsSectionProps = {
	docId: number;
	isAdmin?: boolean;
};

const t = getTranslations('comments');

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
	const { isDemo } = useApp();
	const {
		data: comments = [],
		isLoading,
		error,
		mutate
	} = useGetComments(docId);

	const createComment = async (values: CommentFormPayload) => {
		if (isDemo) {
			const result = await DemoService.createComment(docId, values);

			if (!result.success) {
				throw new Error(result.message);
			}
		} else {
			await requestJson(`/api/docs/${docId}/comments`, {
				method: 'POST',
				body: JSON.stringify(values)
			});
		}

		toast.success(t.form_submit);
		await mutate();
	};

	const replyToComment = async (
		parentId: number,
		values: CommentFormPayload
	) => {
		if (isDemo) {
			const result = await DemoService.createComment(docId, {
				...values,
				parentId
			});

			if (!result.success) {
				throw new Error(result.message);
			}
		} else {
			await requestJson(`/api/comments/${parentId}/reply`, {
				method: 'POST',
				body: JSON.stringify(values)
			});
		}

		toast.success(t.form_reply_submit);
		await mutate();
	};

	const approveComment = async (id: number) => {
		if (isDemo) {
			const result = await DemoService.updateCommentStatus(id, true);

			if (!result.success) {
				throw new Error(result.message);
			}
		} else {
			await requestJson(`/api/comments/${id}/approve`, { method: 'PATCH' });
		}

		toast.success(t.admin_approve_success);
		await mutate();
	};

	const deleteComment = async (id: number) => {
		if (isDemo) {
			const result = await DemoService.deleteComment(id);

			if (!result.success) {
				throw new Error(result.message);
			}
		} else {
			await requestJson(`/api/comments/${id}`, { method: 'DELETE' });
		}

		toast.success(t.admin_delete_success);
		await mutate();
	};

	return (
		<section className="mt-10 space-y-6 border-t pt-8">
			<h2 className="text-xl font-semibold">
				{t.title} ({comments.length})
			</h2>

			<CommentForm onSubmit={createComment} />

			{isLoading && (
				<p className="text-sm text-muted-foreground">{t.loading}</p>
			)}
			{error && <p className="text-sm text-destructive">{t.error}</p>}
			{!isLoading && !error && comments.length === 0 && (
				<p className="text-sm text-muted-foreground">{t.empty}</p>
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
