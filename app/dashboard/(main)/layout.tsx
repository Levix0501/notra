import { BooksNav } from '@/components/books-nav';
import { CreateBookDialog } from '@/components/create-book-dialog';
import { DashboardSidebarFooter } from '@/components/dashboard-sidebar-footer';
import { DashboardSidebarHeader } from '@/components/dashboard-sidebar-header';
import { DashboardSidebarNav } from '@/components/dashboard-sidebar-nav';
import {
	NotraInset,
	NotraInsetHeader,
	NotraSidebar,
	NotraSidebarContent
} from '@/components/notra-sidebar';

export default async function Layout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<NotraSidebar>
				<DashboardSidebarHeader />

				<NotraSidebarContent>
					<DashboardSidebarNav />
					<BooksNav />
				</NotraSidebarContent>

				<DashboardSidebarFooter />
			</NotraSidebar>

			<NotraInset>
				<NotraInsetHeader>
					<div className="flex size-full items-center justify-between">
						<span></span>
					</div>
				</NotraInsetHeader>
				{children}
			</NotraInset>

			<CreateBookDialog />
		</>
	);
}
