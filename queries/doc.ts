import { DocEntity } from '@prisma/client';
import { SWRConfiguration } from 'swr';

import { useFetcher } from '@/hooks/use-fetcher';
import { Nullable } from '@/types/common';
import { DocMetaVo } from '@/types/doc';

export const useGetDocMeta = (
	slug: Nullable<DocEntity['slug']>,
	config?: SWRConfiguration<DocMetaVo>
) => useFetcher<DocMetaVo>(slug ? `/api/docs/${slug}/meta` : void 0, config);
