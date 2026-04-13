'use client';

import { LayoutDashboard, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { getTranslations } from '@/i18n';
import { useGetPendingCommentsCount } from '@/queries/admin-comment';

import {
	NotraSidebarButton,
	NotraSidebarMenu,
	NotraSidebarMenuItem,
	SidebarNavItem
} from './notra-sidebar';

const t = getTranslations('components_dashboard_sidebar_nav');

export function DashboardSidebarNav() {
	const pathname = usePathname();
	const { data: pendingCount } = useGetPendingCommentsCount();
	const pendingCountLabel =
		typeof pendingCount === 'number' && pendingCount > 99
			? '99+'
			: pendingCount;

	const navItems: SidebarNavItem[] = [
		{
			title: t.dashboard,
			url: '/dashboard',
			icon: LayoutDashboard
		},
		{
			title: t.comments,
			url: '/dashboard/comments',
			icon: MessageSquare
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
						{item.url === '/dashboard/comments' &&
							typeof pendingCount === 'number' &&
							pendingCount > 0 && (
								<span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs text-white">
									{pendingCountLabel}
								</span>
							)}
					</NotraSidebarButton>
				</NotraSidebarMenuItem>
			))}
		</NotraSidebarMenu>
	);
}
