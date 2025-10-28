import Link from 'next/link';

import { DEFAULT_SITE_TITLE } from '@/constants/default';
import { SiteSettingsService } from '@/services/site-settings';

import { AccountDropdown } from './account-dropdown';
import { NotraLogo } from './notra-logo';

export async function DashboardSidebarHeader() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();
	const title = siteSettings?.title ?? DEFAULT_SITE_TITLE;

	return (
		<div className="flex h-14 items-center justify-between gap-3 px-4 md:px-2.5">
			<Link
				className="flex h-8 flex-1 items-center gap-2 overflow-hidden"
				href="/"
			>
				<NotraLogo size={28} />
				<span className="flex-1 truncate text-base font-semibold">{title}</span>
			</Link>

			<AccountDropdown />
		</div>
	);
}
