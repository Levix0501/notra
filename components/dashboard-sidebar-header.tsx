import Link from 'next/link';

import { DEFAULT_SITE_TITLE } from '@/constants/default';
import SiteSettingsService from '@/services/site-settings';

import AccountDropdown from './account-dropdown';
import NotraLogo from './notra-logo';

export default async function DashboardSidebarHeader() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();
	const title = siteSettings?.title ?? DEFAULT_SITE_TITLE;

	return (
		<div className="flex h-14 items-center justify-between px-4 md:px-2.5">
			<Link
				className="flex h-8 items-center gap-2 transition-opacity hover:opacity-60"
				href="/"
			>
				<div className="flex size-8 shrink-0 items-center justify-center">
					<NotraLogo size={28} />
				</div>
				<span className="truncate text-base font-semibold">{title}</span>
			</Link>

			<AccountDropdown />
		</div>
	);
}
