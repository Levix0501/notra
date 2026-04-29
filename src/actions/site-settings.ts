'use server';

import { SiteSettingsService } from '@/services/site-settings';
import { UpdateSiteSettingsDto } from '@/types/site-settings';

export async function updateSiteSettings(values: UpdateSiteSettingsDto) {
	const serviceResult = await SiteSettingsService.updateSiteSettings(values);

	return serviceResult.toPlainObject();
}
