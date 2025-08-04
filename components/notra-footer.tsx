import { getTranslations } from '@/i18n';
import SiteSettingsService from '@/services/site-settings';

const t = getTranslations('components_notra_footer');

export default async function NotraFooter() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		<footer className="p-6 text-center text-xs leading-5 text-muted-foreground">
			<h2 className="sr-only">Footer</h2>
			{siteSettings?.copyright && <p>© {siteSettings.copyright}</p>}
			<p
				dangerouslySetInnerHTML={{
					__html: t.powered_by
				}}
			></p>
		</footer>
	);
}
