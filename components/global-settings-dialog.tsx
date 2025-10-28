'use client';

import { Plug, Settings } from 'lucide-react';
import { create } from 'zustand';

import { getTranslations } from '@/i18n';
import { useGetSiteSettings } from '@/queries/site-settings';

import { AnalyticsForm } from './analytics-form';
import { HomePageRedirectForm } from './home-page-redirect-form';
import {
	CloseButton,
	SettingsDialog,
	SettingsTabs,
	SettingsTabsContent,
	SettingsTabsList,
	SettingsTabsTrigger
} from './notra-settings';
import { SiteSettingsForm } from './site-settings-form';
import { Separator } from './ui/separator';

type GlobalSettingsDialogStore = {
	open: boolean;
	setOpen: (open: boolean) => void;
	activeTab: 'appearance' | 'general' | 'integrations';
	setActiveTab: (tab: 'appearance' | 'general' | 'integrations') => void;
};

export const useGlobalSettingsDialog = create<GlobalSettingsDialogStore>(
	(set) => ({
		open: false,
		setOpen: (open) => set({ open }),
		activeTab: 'general',
		setActiveTab: (tab) => set({ activeTab: tab })
	})
);

const t = getTranslations('components_global_settings_dialog');

export function GlobalSettingsDialog() {
	const { open, setOpen, activeTab, setActiveTab } = useGlobalSettingsDialog();
	const { data: siteSettings, mutate: mutateSiteSettings } =
		useGetSiteSettings();

	return (
		<SettingsDialog open={open} onOpenChange={setOpen}>
			<SettingsTabs
				value={activeTab}
				onValueChange={setActiveTab as (value: string) => void}
			>
				<SettingsTabsList>
					<CloseButton onClick={() => setOpen(false)} />

					{/* <SettingsTabsTrigger value="appearance">
						<Palette />
						<div className="flex-1">
							<span className="truncate">{t.appearance}</span>
						</div>
					</SettingsTabsTrigger> */}

					<SettingsTabsTrigger value="general">
						<Settings />
						<div className="flex-1">
							<span className="truncate">{t.general_settings}</span>
						</div>
					</SettingsTabsTrigger>

					<SettingsTabsTrigger value="integrations">
						<Plug />
						<div className="flex-1">
							<span className="truncate">{t.integrations}</span>
						</div>
					</SettingsTabsTrigger>
				</SettingsTabsList>

				<SettingsTabsContent value="appearance">
					<div>123</div>
				</SettingsTabsContent>

				<SettingsTabsContent value="general">
					<HomePageRedirectForm
						homePageRedirectType={siteSettings?.homePageRedirectType ?? 'NONE'}
						mutateSiteSettings={mutateSiteSettings}
						redirectToBookId={siteSettings?.redirectToBookId ?? null}
						redirectToDocId={siteSettings?.redirectToDocId ?? null}
					/>

					<Separator className="my-8" />

					<SiteSettingsForm
						defaultCopyright={siteSettings?.copyright ?? ''}
						defaultDarkLogo={siteSettings?.darkLogo ?? ''}
						defaultDescription={siteSettings?.description ?? ''}
						defaultLogo={siteSettings?.logo ?? ''}
						defaultTitle={siteSettings?.title ?? ''}
						mutateSiteSettings={mutateSiteSettings}
					/>
				</SettingsTabsContent>

				<SettingsTabsContent value="integrations">
					<AnalyticsForm
						defaultGaId={siteSettings?.gaId ?? ''}
						mutateSiteSettings={mutateSiteSettings}
					/>
				</SettingsTabsContent>
			</SettingsTabs>
		</SettingsDialog>
	);
}
