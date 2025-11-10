import { useFetcher } from '@/hooks/use-fetcher';
import { SiteSettingsVo } from '@/types/site-settings';

export const useGetSiteSettings = () =>
	useFetcher<SiteSettingsVo>('/api/site-settings');
