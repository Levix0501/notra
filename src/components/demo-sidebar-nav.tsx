'use client';

import { FlaskConical } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { getTranslations } from '@/i18n';

import {
	NotraSidebarButton,
	NotraSidebarMenu,
	NotraSidebarMenuItem,
	SidebarNavItem
} from './notra-sidebar';

const t = getTranslations('components_demo_sidebar_nav');

export function DemoSidebarNav() {
	const pathname = usePathname();

	const navItems: SidebarNavItem[] = [
		{
			title: t.demo,
			url: '/demo',
			icon: FlaskConical
		}
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
