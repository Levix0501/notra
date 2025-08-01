import { Metadata } from 'next';

import GlobalSettingsDialog from '@/components/global-settings-dialog';
import NotraBackdrop from '@/components/notra-backdrop';
import { getTranslations } from '@/i18n';

const t = getTranslations('app_dashboard_layout');

export const metadata: Metadata = {
	title: t.metadata_title
};

export default function Layout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-dvh">
			<NotraBackdrop />
			{children}
			<GlobalSettingsDialog />
		</div>
	);
}
