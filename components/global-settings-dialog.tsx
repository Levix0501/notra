'use client';

import { Settings } from 'lucide-react';
import { create } from 'zustand';

import { getTranslations } from '@/i18n';

import GeneralSettings from './general-settings';
import {
	CloseButton,
	SettingsDialog,
	SettingsTabs,
	SettingsTabsContent,
	SettingsTabsList,
	SettingsTabsTrigger
} from './notra-settings';
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

	return (
		<SettingsDialog open={open} onOpenChange={setOpen}>
			<SettingsTabs defaultValue="general">
				<SettingsTabsList>
					<CloseButton onClick={() => setOpen(false)} />
					<SettingsTabsTrigger value="general">
						<Settings />
						<div className="flex-1">
							<span className="truncate">{t.general}</span>
						</div>
					</SettingsTabsTrigger>
				</SettingsTabsList>

				<div className="flex w-full flex-col">
					<ScrollArea className="min-h-0 w-full">
						<SettingsTabsContent value="general">
							<GeneralSettings />
						</SettingsTabsContent>
					</ScrollArea>
				</div>
			</SettingsTabs>
		</SettingsDialog>
	);
}
