import Link from 'next/link';

import { DEFAULT_SITE_TITLE } from '@/constants/default';
import SiteSettingsService from '@/services/site-settings';

import DashboardButton from './dashboard-button';
import NotraLogo from './notra-logo';
import { ThemeChanger } from './theme-changer';

interface NotraHeaderProps {
	withDashboardButton?: boolean;
}

export default async function NotraHeader({
	withDashboardButton = true
}: Readonly<NotraHeaderProps>) {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		<header className="sticky top-0 z-40  h-14 px-4 backdrop-blur-[5px] backdrop-saturate-[180%]">
			<div className="container mx-auto flex h-full items-center justify-between">
				<Link className="flex h-full items-center gap-2 font-semibold" href="/">
					<NotraLogo size={24} />
					<span>{siteSettings?.title ?? DEFAULT_SITE_TITLE}</span>
				</Link>

				<div className="flex items-center justify-between gap-2">
					{withDashboardButton && <DashboardButton />}
					<ThemeChanger />
				</div>
			</div>
		</header>
	);
}
