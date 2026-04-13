import useSWR from 'swr';

import { useApp } from '@/contexts/app-context';
import { useFetcher } from '@/hooks/use-fetcher';
import { DemoService } from '@/services/demo';
import { CommentWithReplies } from '@/types/comment';

export const useGetComments = (docId: number) => {
	const { isDemo } = useApp();
	const demo = useSWR(
		isDemo && Number.isInteger(docId) && docId > 0 ? `/demo/comments/${docId}` : void 0,
		() => DemoService.getComments(docId).then((result) => result.data ?? [])
	);
	const api = useFetcher<CommentWithReplies[]>(
		!isDemo && Number.isInteger(docId) && docId > 0
			? `/api/docs/${docId}/comments`
			: void 0
	);

	return isDemo ? demo : api;
};
