'use client';

import { BookText } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { getTranslations } from '@/i18n';

import {
	NotraSidebarButton,
	NotraSidebarMenu,
	NotraSidebarMenuItem
} from './notra-sidebar';

interface BookSidebarNavProps {
	bookSlug: string;
}

const t = getTranslations('components_book_sidebar_nav');

export default function BookSidebarNav({
	bookSlug
}: Readonly<BookSidebarNavProps>) {
	const pathname = usePathname();

	return (
		<NotraSidebarMenu>
			<NotraSidebarMenuItem>
				<NotraSidebarButton
					href={`/dashboard/${bookSlug}`}
					isActive={pathname === `/dashboard/${bookSlug}`}
				>
					<BookText size={16} />
					<span>{t.book_home}</span>
				</NotraSidebarButton>
			</NotraSidebarMenuItem>
		</NotraSidebarMenu>
	);
}
