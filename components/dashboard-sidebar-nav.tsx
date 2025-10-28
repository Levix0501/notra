'use client';

import { LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { getTranslations } from '@/i18n';

import {
	NotraSidebarButton,
	NotraSidebarMenu,
	NotraSidebarMenuItem,
	SidebarNavItem
} from './notra-sidebar';

const t = getTranslations('components_dashboard_sidebar_nav');

export function DashboardSidebarNav() {
	const pathname = usePathname();

	const navItems: SidebarNavItem[] = [
		{
			title: t.dashboard,
			url: '/dashboard',
			icon: LayoutDashboard
		}

		// {
		// 	title: t.appearance,
		// 	icon: Palette,
		// 	onClick: () => {
		// 		useGlobalSettingsDialog.setState({
		// 			open: true,
		// 			activeTab: 'appearance'
		// 		});
		// 	}
		// }
	];

	return (
		<NotraSidebarMenu>
			{navItems.map((item, index) => (
				<NotraSidebarMenuItem key={index}>
					<NotraSidebarButton
						className="px-1"
						href={item.url}
						isActive={pathname === item.url}
						onClick={item.onClick}
					>
						{item.icon && <item.icon size={16} />}
						<span>{item.title}</span>
					</NotraSidebarButton>
				</NotraSidebarMenuItem>
			))}
		</NotraSidebarMenu>
	);
}
