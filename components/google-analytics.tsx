import { GoogleAnalytics as GoogleAnalyticsComponent } from '@next/third-parties/google';

import { SiteSettingsService } from '@/services/site-settings';

export const GoogleAnalytics = async () => {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		process.env.NODE_ENV === 'production' &&
		siteSettings?.gaId && <GoogleAnalyticsComponent gaId={siteSettings.gaId} />
	);
};
