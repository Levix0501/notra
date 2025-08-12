import { useFetcher } from '@/hooks/use-fetcher';
import { DocMetaVo } from '@/types/doc';

export const useGetDocMeta = (slug?: string) =>
	useFetcher<DocMetaVo>(slug ? `/api/docs/${slug}/meta` : void 0);
