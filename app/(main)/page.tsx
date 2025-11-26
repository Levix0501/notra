import { permanentRedirect } from 'next/navigation';

import { BlogCards } from '@/components/blog-cards';
import { SiteSettingsService } from '@/services/site-settings';

export default async function Page() {
	if (process.env.NOTRA_LANDING_REDIRECT) {
		permanentRedirect(process.env.NOTRA_LANDING_REDIRECT);
	}

	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	if (
		siteSettings?.homePageRedirectType === 'BOOK' &&
		siteSettings.redirectToBook?.isPublished
	) {
		permanentRedirect(`/${siteSettings.redirectToBook?.slug}`);
	}

	if (
		siteSettings?.homePageRedirectType === 'DOC' &&
		siteSettings.redirectToDoc?.isPublished &&
		!siteSettings.redirectToDoc.isDeleted &&
		siteSettings.redirectToDoc.book?.isPublished
	) {
		permanentRedirect(
			`/${siteSettings.redirectToDoc.book?.slug}/${siteSettings.redirectToDoc.slug}`
		);
	}

	return <BlogCards />;
}
