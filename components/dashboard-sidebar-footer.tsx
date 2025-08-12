import { ThemeChanger } from './theme-changer';

export default async function DashboardSidebarFooter() {
	return (
		<div className="flex h-14 items-center justify-end gap-3 px-4 md:px-2.5">
			<ThemeChanger />
		</div>
	);
}
