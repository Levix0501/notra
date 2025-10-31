import Link from 'next/link';

import { DEFAULT_SITE_TITLE } from '@/constants/default';
import { SiteSettingsService } from '@/services/site-settings';
import { TreeNodeService } from '@/services/tree-node';

import { DashboardButton } from './dashboard-button';
import { NavbarStatic } from './navbar-static';
import { NavbarStaticMobileButton } from './navbar-static-mobile';
import { NotraLogo } from './notra-logo';

export async function NotraHeader() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();
	const { data: navItems } = await TreeNodeService.getPublishedNavItems();

	return (
		<header className="sticky top-0 z-40 h-14 border-b bg-background px-6 not-md:pr-3">
			<div className="container mx-auto flex h-full items-center gap-3">
				<Link className="flex h-full items-center gap-2 font-semibold" href="/">
					<NotraLogo size={24} />
					<span>{siteSettings?.title ?? DEFAULT_SITE_TITLE}</span>
				</Link>

				<div className="h-full flex-1">
					<NavbarStatic />
				</div>

				<div className="flex h-full items-center gap-1">
					<DashboardButton />

					{navItems && navItems.length > 0 && <NavbarStaticMobileButton />}
				</div>
			</div>
		</header>
	);
}
