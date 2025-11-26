import Link from 'next/link';

import { AccountDropdown } from '@/components/account-dropdown';
import { NotraLogo } from '@/components/notra-logo';
import { DEFAULT_SITE_TITLE } from '@/constants';
import { SiteSettingsService } from '@/services/site-settings';

export default async function Default() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();
	const title = siteSettings?.title ?? DEFAULT_SITE_TITLE;

	return (
		<>
			<Link
				className="flex h-8 flex-1 items-center gap-2 overflow-hidden"
				href="/"
			>
				<NotraLogo size={28} />
				<span className="flex-1 truncate text-base font-semibold">{title}</span>
			</Link>
			<AccountDropdown />
		</>
	);
}
