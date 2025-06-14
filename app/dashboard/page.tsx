import { BookPlus } from 'lucide-react';
import { Metadata } from 'next';

import AccountAvatar from '@/components/account-avatar';
import NotraInset from '@/components/notra/notra-inset';
import NotraInsetHeader from '@/components/notra/notra-inset-header';
import NotraSidebar from '@/components/notra/notra-sidebar';
import NotraSidebarContent from '@/components/notra/notra-sidebar-content';
import { Button } from '@/components/ui/button';
import { DEFAULT_SITE_TITLE } from '@/constants/default';
import { getTranslations } from '@/i18n';
import SiteSettingsService from '@/services/site-settings';

import CreateBookForm from './_components/create-book-form';
import DashboardSidebarHeader from './_components/dashboard-sidebar-header';
import { NavBooks } from './_components/nav-books';
import NavMain from './_components/nav-main';

export const generateMetadata = async (): Promise<Metadata> => {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();
	const t = getTranslations('app_dashboard_page');

	return {
		title: `${t('metadata_title')} - ${siteSettings?.title ?? DEFAULT_SITE_TITLE}`
	};
};

export default async function Page() {
	const t = getTranslations('app_dashboard_page');

	return (
		<>
			<NotraSidebar resizeable className="bg-sidebar">
				<DashboardSidebarHeader />

				<NotraSidebarContent>
					<NavMain />
					<NavBooks />
				</NotraSidebarContent>
			</NotraSidebar>
			<NotraInset>
				<NotraInsetHeader rightActions={<AccountAvatar />} />

				<div className="px-9 py-6">
					<div className="mb-5 text-lg font-medium">{t('start')}</div>

					<div className="mb-9 flex flex-wrap gap-3">
						<CreateBookForm>
							<Button className="h-14 min-w-56 p-0" variant="outline">
								<div className="flex size-full items-center">
									<div className="px-4">
										<BookPlus />
									</div>

									<div className="text-start">
										<p className="text-sm font-medium">{t('new_book')}</p>
										<p className="text-xs font-normal text-gray-500">
											{t('new_book_description')}
										</p>
									</div>
								</div>
							</Button>
						</CreateBookForm>
					</div>
				</div>
			</NotraInset>
		</>
	);
}
