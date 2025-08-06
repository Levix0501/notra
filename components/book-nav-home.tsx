'use client';

import { Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { getTranslations } from '@/i18n';

import { NotraSidebarButton } from './notra-sidebar';

interface BookNavHomeProps {
	bookSlug: string;
}

const t = getTranslations('components_book_nav_home');

export default function BookNavHome({ bookSlug }: Readonly<BookNavHomeProps>) {
	const pathname = usePathname();

	return (
		<div className="mb-1.5 flex w-full items-center gap-2">
			<NotraSidebarButton
				href={`/dashboard/${bookSlug}`}
				isActive={pathname === `/dashboard/${bookSlug}`}
			>
				<Home size={16} />
				<span>{t.home}</span>
			</NotraSidebarButton>
		</div>
	);
}
