import { Settings2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import AccountAvatar from '@/components/account-avatar';
import NotraInset from '@/components/notra/notra-inset';
import NotraInsetHeader from '@/components/notra/notra-inset-header';
import NotraSidebar from '@/components/notra/notra-sidebar';
import NotraSidebarContent from '@/components/notra/notra-sidebar-content';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import BookService from '@/services/book';

import Catalog from './_components/catalog';
import NavHome from './_components/nav-home';
import DashboardSidebarHeader from '../../_components/dashboard-sidebar-header';

export default async function Layout({
	children,
	params
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ book: string }>;
}>) {
	const { book: slug } = await params;
	const { data: book } = await BookService.getBook(slug);

	if (!book) {
		notFound();
	}

	return (
		<>
			<NotraSidebar resizeable>
				<DashboardSidebarHeader />

				<NotraSidebarContent>
					<div className="flex items-center justify-between px-1">
						<span className="font-bold">{book.name}</span>

						<Link href={`/dashboard/${book.slug}/management/settings`}>
							<Button className="size-7" size="icon" variant="ghost">
								<Settings2 size={16} />
								<span className="sr-only">Settings</span>
							</Button>
						</Link>
					</div>
					<Separator className="my-4 bg-border-light" />

					<NavHome bookSlug={book.slug} />

					<Catalog book={book} />
				</NotraSidebarContent>
			</NotraSidebar>

			<NotraInset>
				<NotraInsetHeader rightActions={<AccountAvatar />} />
				{children}
			</NotraInset>
		</>
	);
}
