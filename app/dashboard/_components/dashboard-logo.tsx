import NotraLogo from '@/components/notra/notra-logo';
import {
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK,
	DEFAULT_SITE_TITLE
} from '@/constants/default';
import SiteSettingsService from '@/services/site-settings';

export interface DashboardLogoProps {
	size: number;
}

export default async function DashboardLogo({
	size
}: Readonly<DashboardLogoProps>) {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		<NotraLogo
			darkLogo={
				siteSettings?.darkLogo ?? siteSettings?.logo ?? DEFAULT_SITE_LOGO_DARK
			}
			logo={siteSettings?.logo ?? siteSettings?.darkLogo ?? DEFAULT_SITE_LOGO}
			size={size}
			title={siteSettings?.title ?? DEFAULT_SITE_TITLE}
		/>
	);
}
