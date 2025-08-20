'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { getTranslations } from '@/i18n';

import { Button } from './ui/button';

export default function DashboardButton() {
	const { data } = useSession();

	if (!data) {
		return null;
	}

	return (
		<Link href="/dashboard">
			<Button size="sm">
				{getTranslations('components_dashboard_button').dashboard}
			</Button>
		</Link>
	);
}
