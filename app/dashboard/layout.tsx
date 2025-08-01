import { Metadata } from 'next';

import GlobalSettingsDialog from '@/components/global-settings-dialog';
import NotraBackdrop from '@/components/notra-backdrop';
import { DEFAULT_SITE_TITLE } from '@/constants/default';
import { getTranslations } from '@/i18n';

const t = getTranslations('app_dashboard_layout');

export const generateMetadata = async (): Promise<Metadata> => {
	return {
		title: `${t.metadata_title} - ${DEFAULT_SITE_TITLE}`
	};
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
