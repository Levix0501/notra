'use client';

import { useState } from 'react';

import { updateSiteSettings } from '@/actions/site-settings';
import { getTranslations } from '@/i18n';
import { useGetSiteSettings } from '@/queries/site-settings';

import { Label } from './ui/label';
import { Switch } from './ui/switch';

const t = getTranslations('components_colored_contact_icon_switch');

export const ColoredContactIconSwitch = () => {
	const [isPending, setIsPending] = useState(false);

	const { data: siteSettings, mutate } = useGetSiteSettings();

	const handleChange = async (checked: boolean) => {
		if (!siteSettings) {
			return;
		}

		mutate(
			async () => {
				setIsPending(true);
				const result = await updateSiteSettings({
					coloredContactIcons: checked
				});

				if (!result.success) {
					setIsPending(false);

					throw new Error(result.message);
				}

				setIsPending(false);

				return {
					...siteSettings,
					coloredContactIcons: checked
				};
			},
			{
				optimisticData: {
					...siteSettings,
					coloredContactIcons: checked
				}
			}
		);
	};

	return (
		<div className="flex items-center space-x-2">
			<Switch
				checked={siteSettings?.coloredContactIcons}
				disabled={!siteSettings || isPending}
				id="colored-contact-icons"
				onCheckedChange={handleChange}
			/>
			<Label htmlFor="colored-contact-icons">{t.colored_contact_icons}</Label>
		</div>
	);
};
