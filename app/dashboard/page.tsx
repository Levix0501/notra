import DashboardSidebarHeader from '@/components/dashboard-sidebar-header';
import {
	NotraInset,
	NotraInsetHeader,
	NotraSidebar
} from '@/components/notra-sidebar';

export default function Page() {
	return (
		<>
			<NotraSidebar resizable>
				<DashboardSidebarHeader />
			</NotraSidebar>

			<NotraInset>
				<NotraInsetHeader>
					<div>
						<h1>Dashboard</h1>
					</div>
				</NotraInsetHeader>
			</NotraInset>
		</>
	);
}
