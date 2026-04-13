'use client';

import dayjs from 'dayjs';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { CommentWithReplies } from '@/types/comment';

import { CommentForm } from './comment-form';

type CommentItemProps = {
	comment: CommentWithReplies;
	isAdmin?: boolean;
	depth?: number;
	onReply: (parentId: number, values: CommentFormPayload) => Promise<void>;
	onApprove: (id: number) => Promise<void>;
	onDelete: (id: number) => Promise<void>;
};

type CommentFormPayload = {
	content: string;
	authorName: string;
	authorEmail: string;
	authorWebsite?: string;
	honeypot?: string | null;
};

export function CommentItem({
	comment,
	isAdmin = false,
	depth = 0,
	onReply,
	onApprove,
	onDelete
}: CommentItemProps) {
	const [isReplying, setIsReplying] = useState(false);

	return (
		<div className="space-y-3 rounded-md border p-4">
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="text-sm font-semibold">{comment.authorName}</p>
					<p className="text-xs text-muted-foreground">
						{dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						variant="ghost"
						onClick={() => setIsReplying((v) => !v)}
					>
						Reply
					</Button>
					{isAdmin && !comment.isApproved && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => onApprove(comment.id)}
						>
							Approve
						</Button>
					)}
					{isAdmin && (
						<Button
							size="sm"
							variant="destructive"
							onClick={() => onDelete(comment.id)}
						>
							Delete
						</Button>
					)}
				</div>
			</div>

			<p className="text-sm whitespace-pre-wrap">{comment.content}</p>

			{isReplying && (
				<div className="rounded-md border bg-muted/20 p-3">
					<CommentForm
						submitText="Post reply"
						onSubmit={async (values) => {
							await onReply(comment.id, values);
							setIsReplying(false);
						}}
					/>
				</div>
			)}

			{comment.replies && comment.replies.length > 0 && (
				<div
					className="space-y-3 pl-4"
					style={{ marginLeft: `${depth * 8}px` }}
				>
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply.id}
							comment={reply}
							depth={depth + 1}
							isAdmin={isAdmin}
							onApprove={onApprove}
							onDelete={onDelete}
							onReply={onReply}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export type { CommentFormPayload };
