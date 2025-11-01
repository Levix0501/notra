import { redirect } from 'next/navigation';

import { BlogCards } from '@/components/blog-cards';
import { SiteSettingsService } from '@/services/site-settings';

export default async function Page() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	if (
		siteSettings?.homePageRedirectType === 'BOOK' &&
		siteSettings.redirectToBook?.isPublished
	) {
		redirect(`/${siteSettings.redirectToBook?.slug}`);
	}

	if (
		siteSettings?.homePageRedirectType === 'DOC' &&
		siteSettings.redirectToDoc?.isPublished &&
		!siteSettings.redirectToDoc.isDeleted &&
		siteSettings.redirectToDoc.book?.isPublished
	) {
		redirect(
			`/${siteSettings.redirectToDoc.book?.slug}/${siteSettings.redirectToDoc.slug}`
		);
	}

	return <BlogCards />;
}
