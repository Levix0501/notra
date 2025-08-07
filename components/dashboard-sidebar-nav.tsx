'use client';

import { Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { getTranslations } from '@/i18n';

import {
	NotraSidebarButton,
	NotraSidebarMenu,
	NotraSidebarMenuItem,
	SidebarNavItem
} from './notra-sidebar';

const t = getTranslations('components_dashboard_sidebar_nav');

export default function DashboardSidebarNav() {
	const pathname = usePathname();

	const navItems: SidebarNavItem[] = [
		{
			title: t.home,
			url: '/dashboard',
			icon: Home
		}
	];

	return (
		<NotraSidebarMenu>
			{navItems.map((item) => (
				<NotraSidebarMenuItem key={item.url}>
					<NotraSidebarButton href={item.url} isActive={pathname === item.url}>
						{item.icon && <item.icon size={16} />}
						<span>{item.title}</span>
					</NotraSidebarButton>
				</NotraSidebarMenuItem>
			))}
		</NotraSidebarMenu>
	);
}
