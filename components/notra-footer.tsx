import { getTranslations } from '@/i18n';
import { SiteSettingsService } from '@/services/site-settings';

import { ThemeChanger } from './theme-changer';

const t = getTranslations('components_notra_footer');

export async function NotraFooter() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		<div className="border-t border-border">
			<div className="mx-auto max-w-[1248px] px-6">
				<footer className="py-9 text-sm text-muted-foreground">
					<h2 className="sr-only">Footer</h2>

					<div className="flex items-center justify-between text-xs md:text-sm">
						<p>
							{siteSettings?.copyright ? `© ${siteSettings.copyright} · ` : ''}
							<span
								dangerouslySetInnerHTML={{
									__html: t.powered_by
								}}
							></span>
						</p>

						<ThemeChanger />
					</div>
				</footer>
			</div>
		</div>
	);
}
