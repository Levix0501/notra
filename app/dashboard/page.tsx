import DashboardSidebarHeader from '@/components/dashboard-sidebar-header';
import DashboardSidebarNav from '@/components/dashboard-sidebar-nav';
import {
	NotraInset,
	NotraInsetHeader,
	NotraSidebar,
	NotraSidebarContent
} from '@/components/notra-sidebar';
import SiteIndexPageViewTabs from '@/components/site-index-page-view-tabs';
import { ThemeChanger } from '@/components/theme-changer';

export default function Page() {
	return (
		<>
			<NotraSidebar>
				<DashboardSidebarHeader />

				<NotraSidebarContent>
					<DashboardSidebarNav />
				</NotraSidebarContent>
			</NotraSidebar>

			<NotraInset>
				<NotraInsetHeader>
					<div className="flex size-full items-center justify-between">
						<span></span>

						<ThemeChanger />
					</div>
				</NotraInsetHeader>

				<main className="container mx-auto p-4 md:p-8">
					<SiteIndexPageViewTabs />
				</main>
			</NotraInset>
		</>
	);
}
