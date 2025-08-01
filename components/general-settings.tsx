import { getTranslations } from '@/i18n';

import { ThemeChanger } from './theme-changer';

const t = getTranslations('components_general_settings');

export default function GeneralSettings() {
	return (
		<div className="flex min-h-15 w-full items-center py-2">
			<div className="flex w-full items-center justify-between">
				<div>{t.theme}</div>
				<div>
					<ThemeChanger />
				</div>
			</div>
		</div>
	);
}
