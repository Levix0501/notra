import { BookSettingsSheet } from '@/components/book-settings-sheet';
import { CreateBookDialog } from '@/components/create-book-dialog';
import { DashboardSidebarFooter } from '@/components/dashboard-sidebar-footer';
import { DocSettingsSheet } from '@/components/doc-settings-sheet';
import { NotraBackdrop } from '@/components/notra-backdrop';
import {
	NotraInset,
	NotraInsetHeader,
	NotraSidebar,
	NotraSidebarContent
} from '@/components/notra-sidebar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppProvider } from '@/contexts/app-context';
import { getTranslations } from '@/i18n';

export default async function Layout({
	children,
	breadcrumb,
	sidebar,
	header
}: LayoutProps<'/demo'>) {
	const t = getTranslations('app_demo_layout');

	return (
		<AppProvider isDemo>
			<div className="min-h-dvh">
				<NotraBackdrop />

				<NotraSidebar>
					<div className="flex h-14 items-center justify-between px-4 md:px-2.5">
						{breadcrumb}
					</div>

					<NotraSidebarContent>{sidebar}</NotraSidebarContent>
					<div className="px-4 md:px-2.5">
						<Alert>
							<AlertTitle>{t.alert_title}</AlertTitle>
							<AlertDescription>{t.alert_description}</AlertDescription>
						</Alert>
					</div>
					<DashboardSidebarFooter />
				</NotraSidebar>

				<NotraInset>
					<NotraInsetHeader>{header}</NotraInsetHeader>

					{children}
				</NotraInset>
			</div>

			<CreateBookDialog />
			<BookSettingsSheet />
			<DocSettingsSheet />
		</AppProvider>
	);
}
