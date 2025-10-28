import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { getTranslations } from '@/i18n';

import { AccountDropdown } from './account-dropdown';
import { NotraLogo } from './notra-logo';

export function BookSidebarHeader() {
	return (
		<div className="flex h-14 items-center justify-between px-4 md:px-2.5">
			<div className="flex h-8 items-center gap-1">
				<Link href="/">
					<NotraLogo size={28} />
				</Link>

				<ChevronRight className="size-3.5" />

				<Link
					className="text-sm opacity-60 transition-opacity hover:opacity-100"
					href="/dashboard"
				>
					{getTranslations('components_dashboard_sidebar_nav').dashboard}
				</Link>
			</div>

			<AccountDropdown />
		</div>
	);
}
