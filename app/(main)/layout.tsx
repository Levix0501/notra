import React from 'react';

import { NavbarStaticMobile } from '@/components/navbar-static-mobile';
import { NotraFooter } from '@/components/notra-footer';
import { NotraHeader } from '@/components/notra-header';
import { TreeNodeService } from '@/services/tree-node';

export default async function Layout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { data: navItems } = await TreeNodeService.getPublishedNavItems();

	return (
		<>
			<NotraHeader />
			<main className="container mx-auto md:min-h-[calc(100dvh-80px)] md:pt-6">
				{children}
			</main>
			{navItems && navItems.length > 0 && (
				<NavbarStaticMobile navItems={navItems} />
			)}
			<NotraFooter />
		</>
	);
}
