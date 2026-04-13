import { useFetcher } from '@/hooks/use-fetcher';
import { CommentWithReplies } from '@/types/comment';

export const useGetComments = (docId: number) => {
	return useFetcher<CommentWithReplies[]>(
		Number.isInteger(docId) && docId > 0
			? `/api/docs/${docId}/comments`
			: void 0
	);
};
