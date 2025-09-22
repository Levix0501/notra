'use client';

import { BookEntity } from '@prisma/client';
import { BookText } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { getTranslations } from '@/i18n';

import {
	NotraSidebarButton,
	NotraSidebarMenu,
	NotraSidebarMenuItem
} from './notra-sidebar';

interface BookSidebarNavProps {
	bookId: BookEntity['id'];
}

const t = getTranslations('components_book_sidebar_nav');

export default function BookSidebarNav({
	bookId
}: Readonly<BookSidebarNavProps>) {
	const pathname = usePathname();

	return (
		<NotraSidebarMenu>
			<NotraSidebarMenuItem>
				<NotraSidebarButton
					href={`/dashboard/${bookId}`}
					isActive={pathname === `/dashboard/${bookId}`}
				>
					<BookText size={16} />
					<span>{t.book_home}</span>
				</NotraSidebarButton>
			</NotraSidebarMenuItem>
		</NotraSidebarMenu>
	);
}
