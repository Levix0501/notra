import { Metadata } from 'next';

import BooksNav from '@/components/books-nav';
import { CreateBookDialog } from '@/components/create-book-dialog';
import DashboardSidebarFooter from '@/components/dashboard-sidebar-footer';
import DashboardSidebarHeader from '@/components/dashboard-sidebar-header';
import DashboardSidebarNav from '@/components/dashboard-sidebar-nav';
import {
	NotraInset,
	NotraInsetHeader,
	NotraSidebar,
	NotraSidebarContent
} from '@/components/notra-sidebar';
import SiteIndexPageViewTabs from '@/components/site-index-page-view-tabs';
import { getTranslations } from '@/i18n';

const t = getTranslations('app_dashboard_layout');

export const metadata: Metadata = {
	title: t.metadata_title
};

export default function Page() {
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

				<main className="container mx-auto p-4 md:p-8">
					<SiteIndexPageViewTabs />
				</main>
			</NotraInset>

			<CreateBookDialog />
		</>
	);
}
