import React from 'react';

import { NotraFooter } from '@/components/notra-footer';
import { NotraHeader } from '@/components/notra-header';

export default async function Layout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<NotraHeader />
			<main className="mx-auto max-w-screen-2xl md:pt-6">{children}</main>
			<NotraFooter />
		</>
	);
}
