import Image from 'next/image';

import {
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK,
	DEFAULT_SITE_TITLE
} from '@/constants/default';
import { SiteSettingsService } from '@/services/site-settings';

export interface NotraLogoProps {
	size: number;
}

export async function NotraLogo({ size }: Readonly<NotraLogoProps>) {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();
	const darkLogo =
		siteSettings?.darkLogo ?? siteSettings?.logo ?? DEFAULT_SITE_LOGO_DARK;
	const logo =
		siteSettings?.logo ?? siteSettings?.darkLogo ?? DEFAULT_SITE_LOGO;
	const title = siteSettings?.title ?? DEFAULT_SITE_TITLE;

	return (
		<div className="relative" style={{ width: size, height: size }}>
			<Image
				fill
				priority
				alt={`${title} Logo`}
				className="dark:invisible"
				sizes={`${size}px`}
				src={logo}
			/>
			<Image
				fill
				priority
				alt={`${title} Dark Logo`}
				className="invisible dark:visible"
				sizes={`${size}px`}
				src={darkLogo}
			/>
		</div>
	);
}
