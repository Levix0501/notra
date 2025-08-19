'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { getTranslations } from '@/i18n';

import { Button } from './ui/button';

export default function DashboardButton() {
	const { data } = useSession();
	const router = useRouter();

	if (!data) {
		return null;
	}

	const handleClick = () => {
		router.push('/dashboard');
	};

	return (
		<Button size="sm" onClick={handleClick}>
			{getTranslations('components_dashboard_button').dashboard}
		</Button>
	);
}
