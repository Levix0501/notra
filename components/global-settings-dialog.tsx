'use client';

import { BookText, ChartPie, FileSliders, Settings } from 'lucide-react';
import { create } from 'zustand';

import { getTranslations } from '@/i18n';
import { useGetBook } from '@/queries/book';
import { useGetDocMeta } from '@/queries/doc';
import { useGetSiteSettings } from '@/queries/site-settings';

import AnalyticsForm from './analytics-form';
import BookSettingsForm from './book-settings-form';
import DocSettingsForm from './doc-settings-form';
import {
	CloseButton,
	SettingsDialog,
	SettingsTabs,
	SettingsTabsContent,
	SettingsTabsList,
	SettingsTabsTrigger
} from './notra-settings';
import NotraSkeleton from './notra-skeleton';
import SiteSettingsForm from './site-settings-form';

type GlobalSettingsDialogStore = {
	open: boolean;
	setOpen: (open: boolean) => void;
	tab: 'doc' | 'book' | 'site' | 'analytics';
	setTab: (tab: 'doc' | 'book' | 'site' | 'analytics') => void;
	docSlug: string;
	setDocSlug: (docSlug: string) => void;
	bookSlug: string;
	setBookSlug: (bookSlug: string) => void;
};

export const useGlobalSettingsDialog = create<GlobalSettingsDialogStore>(
	(set) => ({
		open: false,
		setOpen: (open) => set({ open }),
		tab: 'site',
		setTab: (tab) => set({ tab }),
		docSlug: '',
		setDocSlug: (docSlug) => set({ docSlug }),
		bookSlug: '',
		setBookSlug: (bookSlug) => set({ bookSlug })
	})
);

const t = getTranslations('components_global_settings_dialog');

export default function GlobalSettingsDialog() {
	const { open, setOpen, tab, docSlug, bookSlug } = useGlobalSettingsDialog();
	const { data: siteSettings, mutate: mutateSiteSettings } =
		useGetSiteSettings();
	const {
		data: book,
		mutate: mutateBook,
		isLoading: isBookLoading
	} = useGetBook(bookSlug);
	const {
		data: docMeta,
		mutate: mutateDocMeta,
		isLoading: isDocMetaLoading
	} = useGetDocMeta({
		book: bookSlug,
		doc: docSlug
	});

	return (
		<SettingsDialog open={open} onOpenChange={setOpen}>
			<SettingsTabs defaultValue={tab}>
				<SettingsTabsList>
					<CloseButton onClick={() => setOpen(false)} />
					{docSlug && (
						<SettingsTabsTrigger value="doc">
							<FileSliders />
							<div className="flex-1">
								<span className="truncate">{t.doc_settings}</span>
							</div>
						</SettingsTabsTrigger>
					)}

					{bookSlug && (
						<SettingsTabsTrigger value="book">
							<BookText />
							<div className="flex-1">
								<span className="truncate">{t.book_settings}</span>
							</div>
						</SettingsTabsTrigger>
					)}

					<SettingsTabsTrigger value="site">
						<Settings />
						<div className="flex-1">
							<span className="truncate">{t.site_settings}</span>
						</div>
					</SettingsTabsTrigger>

					<SettingsTabsTrigger value="analytics">
						<ChartPie />
						<div className="flex-1">
							<span className="truncate">{t.analytics_settings}</span>
						</div>
					</SettingsTabsTrigger>
				</SettingsTabsList>

				<SettingsTabsContent value="doc">
					{isDocMetaLoading ? (
						<NotraSkeleton />
					) : (
						<DocSettingsForm
							key={JSON.stringify(docMeta)}
							bookId={docMeta?.bookId ?? 0}
							bookSlug={bookSlug}
							defaultDocSlug={docMeta?.slug ?? ''}
							docId={docMeta?.id ?? 0}
							mutateDocMeta={mutateDocMeta}
						/>
					)}
				</SettingsTabsContent>

				<SettingsTabsContent value="book">
					{isBookLoading ? (
						<NotraSkeleton />
					) : (
						<BookSettingsForm
							key={JSON.stringify(book)}
							bookId={book?.id ?? 0}
							defaultName={book?.name ?? ''}
							defaultSlug={book?.slug ?? ''}
							mutateBook={mutateBook}
						/>
					)}
				</SettingsTabsContent>

				<SettingsTabsContent value="site">
					<SiteSettingsForm
						key={JSON.stringify(siteSettings)}
						defaultCopyright={siteSettings?.copyright ?? ''}
						defaultDarkLogo={siteSettings?.darkLogo ?? ''}
						defaultDescription={siteSettings?.description ?? ''}
						defaultLogo={siteSettings?.logo ?? ''}
						defaultTitle={siteSettings?.title ?? ''}
						mutateSiteSettings={mutateSiteSettings}
					/>
				</SettingsTabsContent>

				<SettingsTabsContent value="analytics">
					<AnalyticsForm
						key={JSON.stringify(siteSettings)}
						defaultGaId={siteSettings?.gaId ?? ''}
						mutateSiteSettings={mutateSiteSettings}
					/>
				</SettingsTabsContent>
			</SettingsTabs>
		</SettingsDialog>
	);
}
