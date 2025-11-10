import { getTranslations } from '@/i18n';
import { SiteSettingsService } from '@/services/site-settings';

import { ContactInfo } from './contact-info';
import { ThemeChanger } from './theme-changer';

const t = getTranslations('components_notra_footer');

export async function NotraFooter() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		<div className="border-t">
			<div className="mx-auto max-w-[1248px] px-6">
				<footer className="py-9 text-sm text-muted-foreground">
					<h2 className="sr-only">Footer</h2>

					<div className="flex items-center justify-between text-xs md:text-sm">
						<div className="flex flex-initial flex-col items-stretch justify-start gap-3">
							<p>
								{siteSettings?.copyright
									? `© ${siteSettings.copyright} · `
									: ''}
								<span
									dangerouslySetInnerHTML={{
										__html: t.powered_by
									}}
								></span>
							</p>
							<ContactInfo />
						</div>

						<ThemeChanger />
					</div>
				</footer>
			</div>
		</div>
	);
}
