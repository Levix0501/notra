'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { getTranslations } from '@/i18n';
import {
	AdminCommentStatus,
	useGetAdminComments
} from '@/queries/admin-comment';

const t = getTranslations('comments');

export default function CommentsAdminPage() {
	const [status, setStatus] = useState<AdminCommentStatus>('pending');
	const {
		data: comments = [],
		isLoading,
		mutate
	} = useGetAdminComments(status);

	const pendingCount = useMemo(
		() => comments.filter((comment) => !comment.isApproved).length,
		[comments]
	);

	const approveComment = async (id: number) => {
		const response = await fetch(`/api/comments/${id}/approve`, {
			method: 'PATCH'
		});
		const result = (await response.json()) as {
			success: boolean;
			message: string;
		};

		if (!response.ok || !result.success) {
			toast.error(result.message || t.error);

			return;
		}

		toast.success(t.admin_approve_success);
		await mutate();
	};

	const deleteComment = async (id: number) => {
		const response = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
		const result = (await response.json()) as {
			success: boolean;
			message: string;
		};

		if (!response.ok || !result.success) {
			toast.error(result.message || t.error);

			return;
		}

		toast.success(t.admin_delete_success);
		await mutate();
	};

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">{t.admin_title}</h1>
					<p className="text-sm text-muted-foreground">
						{t.pending_count.replace('{count}', String(pendingCount))}
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						size="sm"
						variant={status === 'pending' ? 'default' : 'outline'}
						onClick={() => setStatus('pending')}
					>
						{t.filter_pending}
					</Button>
					<Button
						size="sm"
						variant={status === 'approved' ? 'default' : 'outline'}
						onClick={() => setStatus('approved')}
					>
						{t.filter_approved}
					</Button>
					<Button
						size="sm"
						variant={status === 'all' ? 'default' : 'outline'}
						onClick={() => setStatus('all')}
					>
						{t.filter_all}
					</Button>
				</div>
			</div>

			{isLoading && (
				<p className="text-sm text-muted-foreground">{t.loading}</p>
			)}

			{!isLoading && comments.length === 0 && (
				<p className="text-sm text-muted-foreground">{t.empty}</p>
			)}

			<div className="space-y-3">
				{comments.map((comment) => (
					<div
						key={comment.id}
						className="flex flex-col gap-3 rounded-md border p-4 md:flex-row md:items-start md:justify-between"
					>
						<div className="space-y-1">
							<p className="text-sm font-semibold">
								{comment.authorName} ({comment.authorEmail})
							</p>
							<p className="text-xs text-muted-foreground">
								#{comment.id} - {comment.doc.title}
							</p>
							<p className="text-sm whitespace-pre-wrap">{comment.content}</p>
						</div>

						<div className="flex items-center gap-2">
							{!comment.isApproved && (
								<Button size="sm" onClick={() => approveComment(comment.id)}>
									{t.admin_approve}
								</Button>
							)}
							<Button
								size="sm"
								variant="destructive"
								onClick={() => deleteComment(comment.id)}
							>
								{t.admin_delete}
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
