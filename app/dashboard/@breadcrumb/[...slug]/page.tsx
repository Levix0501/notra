import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { NotraLogo } from '@/components/notra-logo';
import { getTranslations } from '@/i18n';

export const generateStaticParams = async () => {
	return [];
};

export default function Page() {
	return (
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
	);
}
