import { AccountDropdown } from '@/components/account-dropdown';
import { BookSettingsSheet } from '@/components/book-settings-sheet';
import { CreateBookDialog } from '@/components/create-book-dialog';
import { DashboardSidebarFooter } from '@/components/dashboard-sidebar-footer';
import { DocSettingsSheet } from '@/components/doc-settings-sheet';
import { GlobalSettingsDialog } from '@/components/global-settings-dialog';
import { NotraBackdrop } from '@/components/notra-backdrop';
import {
	NotraInset,
	NotraInsetHeader,
	NotraSidebar,
	NotraSidebarContent
} from '@/components/notra-sidebar';
import { AppProvider } from '@/contexts/app-context';

export default function Layout({
	children,
	sidebar,
	breadcrumb,
	header
}: Readonly<LayoutProps<'/dashboard'>>) {
	return (
		<AppProvider isDemo={false}>
			<div className="min-h-dvh">
				<NotraBackdrop />
				<NotraSidebar>
					<div className="flex h-14 items-center justify-between px-4 md:px-2.5">
						{breadcrumb}
						<AccountDropdown />
					</div>

					<NotraSidebarContent>{sidebar}</NotraSidebarContent>

					<DashboardSidebarFooter />
				</NotraSidebar>

				<NotraInset>
					<NotraInsetHeader>{header}</NotraInsetHeader>
					{children}
				</NotraInset>

				<CreateBookDialog />
				<GlobalSettingsDialog />
				<BookSettingsSheet />
				<DocSettingsSheet />
			</div>
		</AppProvider>
	);
}
