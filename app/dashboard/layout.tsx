import GlobalSettingsDialog from '@/components/global-settings-dialog';
import NotraBackdrop from '@/components/notra-backdrop';

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
