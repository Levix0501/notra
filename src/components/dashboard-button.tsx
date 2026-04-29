import Link from 'next/link';

import { getTranslations } from '@/i18n';

import { Button } from './ui/button';

export function DashboardButton() {
	return (
		<Link href="/dashboard">
			<Button size="sm" variant="outline">
				{getTranslations('components_dashboard_button').dashboard}
			</Button>
		</Link>
	);
}
