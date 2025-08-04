'use client';

import { Settings } from 'lucide-react';
import { create } from 'zustand';

import { getTranslations } from '@/i18n';
import { useGetSiteSettings } from '@/queries/site-settings';

import {
	CloseButton,
	SettingsDialog,
	SettingsTabs,
	SettingsTabsContent,
	SettingsTabsList,
	SettingsTabsTrigger
} from './notra-settings';
import SiteSettingsForm from './site-settings-form';
import { ScrollArea } from './ui/scroll-area';

type GlobalSettingsDialogStore = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export const useGlobalSettingsDialog = create<GlobalSettingsDialogStore>(
	(set) => ({
		open: false,
		setOpen: (open) => set({ open })
	})
);

const t = getTranslations('components_global_settings_dialog');

export default function GlobalSettingsDialog() {
	const open = useGlobalSettingsDialog((state) => state.open);
	const setOpen = useGlobalSettingsDialog((state) => state.setOpen);
	const { data: siteSettings, mutate } = useGetSiteSettings();

	return (
		<SettingsDialog open={open} onOpenChange={setOpen}>
			<SettingsTabs defaultValue="site-settings">
				<SettingsTabsList>
					<CloseButton onClick={() => setOpen(false)} />
					<SettingsTabsTrigger value="site-settings">
						<Settings />
						<div className="flex-1">
							<span className="truncate">{t.site_settings}</span>
						</div>
					</SettingsTabsTrigger>
				</SettingsTabsList>

				<div className="flex w-full flex-col">
					<ScrollArea className="min-h-0 w-full">
						<SettingsTabsContent value="site-settings">
							<SiteSettingsForm
								key={JSON.stringify(siteSettings)}
								defaultCopyright={siteSettings?.copyright ?? ''}
								defaultDarkLogo={siteSettings?.darkLogo ?? ''}
								defaultDescription={siteSettings?.description ?? ''}
								defaultLogo={siteSettings?.logo ?? ''}
								defaultTitle={siteSettings?.title ?? ''}
								mutateSiteSettings={mutate}
							/>
						</SettingsTabsContent>
					</ScrollArea>
				</div>
			</SettingsTabs>
		</SettingsDialog>
	);
}
