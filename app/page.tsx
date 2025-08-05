import { IndexPageType } from '@prisma/client';

import IndexPageDocView from '@/components/index-page-doc-view';
import NotraFooter from '@/components/notra-footer';
import NotraHeader from '@/components/notra-header';
import SiteSettingsService from '@/services/site-settings';

export default async function Page() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		<div className="flex min-h-dvh flex-col">
			<NotraHeader />

			<main className="container mx-auto flex-1">
				{siteSettings?.indexPageType === IndexPageType.DOC ? (
					<IndexPageDocView
						indexDescription={siteSettings?.indexDescription ?? ''}
						indexTitle={siteSettings?.indexTitle ?? ''}
						isMainNewTab={siteSettings?.isMainNewTab ?? false}
						isSubNewTab={siteSettings?.isSubNewTab ?? false}
						mainActionText={siteSettings?.mainActionText ?? ''}
						mainActionUrl={siteSettings?.mainActionUrl ?? '#'}
						subActionText={siteSettings?.subActionText ?? ''}
						subActionUrl={siteSettings?.subActionUrl ?? '#'}
					/>
				) : null}
			</main>

			<NotraFooter />
		</div>
	);
}
