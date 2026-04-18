import {
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK,
	DEFAULT_SITE_TITLE
} from '@/constants';
import { normalizeStorageImageUrl } from '@/lib/image';
import { SiteSettingsService } from '@/services/site-settings';

export interface NotraLogoProps {
	size: number;
}

export async function NotraLogo({ size }: Readonly<NotraLogoProps>) {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();
	const darkLogoRaw =
		siteSettings?.darkLogo ?? siteSettings?.logo ?? DEFAULT_SITE_LOGO_DARK;
	const logoRaw =
		siteSettings?.logo ?? siteSettings?.darkLogo ?? DEFAULT_SITE_LOGO;
	const darkLogo = normalizeStorageImageUrl(darkLogoRaw) ?? darkLogoRaw;
	const logo = normalizeStorageImageUrl(logoRaw) ?? logoRaw;
	const title = siteSettings?.title ?? DEFAULT_SITE_TITLE;

	return (
		<div className="relative" style={{ width: size, height: size }}>
			<img
				alt={`${title} Logo`}
				className="absolute inset-0 size-full object-contain dark:invisible"
				height={size}
				src={logo}
				width={size}
			/>
			<img
				alt={`${title} Dark Logo`}
				className="invisible absolute inset-0 size-full object-contain dark:visible"
				height={size}
				src={darkLogo}
				width={size}
			/>
		</div>
	);
}
