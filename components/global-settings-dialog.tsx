'use client';

import { BookEntity, DocEntity } from '@prisma/client';
import { BookText, ChartPie, FileSliders, Settings } from 'lucide-react';
import { create } from 'zustand';

import { getTranslations } from '@/i18n';
import { useGetBook } from '@/queries/book';
import { useGetDocMeta } from '@/queries/doc';
import { useGetSiteSettings } from '@/queries/site-settings';
import { Nullable } from '@/types/common';

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
	docId: Nullable<DocEntity['id']>;
	setDocId: (docId: Nullable<DocEntity['id']>) => void;
	bookId: Nullable<BookEntity['id']>;
	setBookId: (bookId: Nullable<BookEntity['id']>) => void;
};

export const useGlobalSettingsDialog = create<GlobalSettingsDialogStore>(
	(set) => ({
		open: false,
		setOpen: (open) => set({ open }),
		tab: 'site',
		setTab: (tab) => set({ tab }),
		docId: null,
		setDocId: (docId) => set({ docId }),
		bookId: null,
		setBookId: (bookId) => set({ bookId })
	})
);

const t = getTranslations('components_global_settings_dialog');

export default function GlobalSettingsDialog() {
	const { open, setOpen, tab, docId, bookId } = useGlobalSettingsDialog();
	const { data: siteSettings, mutate: mutateSiteSettings } =
		useGetSiteSettings();
	const {
		data: book,
		mutate: mutateBook,
		isLoading: isBookLoading
	} = useGetBook(bookId);
	const {
		data: docMeta,
		mutate: mutateDocMeta,
		isLoading: isDocMetaLoading
	} = useGetDocMeta({
		bookId,
		docId
	});

	return (
		<SettingsDialog open={open} onOpenChange={setOpen}>
			<SettingsTabs defaultValue={tab}>
				<SettingsTabsList>
					<CloseButton onClick={() => setOpen(false)} />
					{docId && (
						<SettingsTabsTrigger value="doc">
							<FileSliders />
							<div className="flex-1">
								<span className="truncate">{t.doc_settings}</span>
							</div>
						</SettingsTabsTrigger>
					)}

					{bookId && (
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
							bookId={docMeta?.bookId ?? 0}
							defaultDocCover={docMeta?.cover ?? ''}
							defaultDocSlug={docMeta?.slug ?? ''}
							defaultDocSummary={docMeta?.summary ?? ''}
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
