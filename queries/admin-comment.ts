import { useFetcher } from '@/hooks/use-fetcher';

type AdminCommentStatus = 'all' | 'pending' | 'approved';

export const useGetAdminComments = (status: AdminCommentStatus) => {
	return useFetcher<
		{
			id: number;
			content: string;
			authorName: string;
			authorEmail: string;
			isApproved: boolean;
			createdAt: string;
			doc: {
				id: number;
				title: string;
				slug: string;
			};
		}[]
	>(`/api/comments?status=${status}`);
};

export type { AdminCommentStatus };
