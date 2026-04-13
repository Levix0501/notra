'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getTranslations } from '@/i18n';
import {
	AdminCommentStatus,
	useGetAdminComments,
	useGetPendingCommentsCount
} from '@/queries/admin-comment';

const t = getTranslations('comments');

export default function CommentsAdminPage() {
	const [status, setStatus] = useState<AdminCommentStatus>('pending');
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const {
		data: comments = [],
		isLoading,
		mutate
	} = useGetAdminComments(status);
	const { data: pendingCount = 0 } = useGetPendingCommentsCount();
	const allSelected =
		comments.length > 0 &&
		comments.every((comment) => selectedIds.includes(comment.id));

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

	const toggleSelected = (id: number) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
		);
	};

	const bulkAction = async (action: 'approve' | 'delete') => {
		if (selectedIds.length === 0) {
			return;
		}

		const response = await fetch('/api/comments/bulk', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				action,
				ids: selectedIds
			})
		});
		const result = (await response.json()) as {
			success: boolean;
			message: string;
		};

		if (!response.ok || !result.success) {
			toast.error(result.message || t.error);

			return;
		}

		toast.success(
			action === 'approve'
				? t.admin_bulk_approve_success
				: t.admin_bulk_delete_success
		);
		setSelectedIds([]);
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
						disabled={selectedIds.length === 0}
						size="sm"
						variant="outline"
						onClick={() => bulkAction('approve')}
					>
						{t.admin_bulk_approve}
					</Button>
					<Button
						disabled={selectedIds.length === 0}
						size="sm"
						variant="destructive"
						onClick={() => bulkAction('delete')}
					>
						{t.admin_bulk_delete}
					</Button>
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
				{comments.length > 0 && (
					<div className="flex items-center gap-2">
						<Checkbox
							checked={allSelected}
							onCheckedChange={(checked) => {
								if (checked) {
									setSelectedIds(comments.map((comment) => comment.id));

									return;
								}

								setSelectedIds([]);
							}}
						/>
						<span className="text-sm text-muted-foreground">
							{t.admin_select_all}
						</span>
					</div>
				)}

				{comments.map((comment) => (
					<div
						key={comment.id}
						className="flex flex-col gap-3 rounded-md border p-4 md:flex-row md:items-start md:justify-between"
					>
						<div className="space-y-1">
							<Checkbox
								checked={selectedIds.includes(comment.id)}
								onCheckedChange={() => toggleSelected(comment.id)}
							/>
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
