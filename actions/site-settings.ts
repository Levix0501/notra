'use server';

import { revalidatePath } from 'next/cache';

import { SiteSettingsService } from '@/services/site-settings';
import { UpdateSiteSettingsDto } from '@/types/site-settings';

export async function updateSiteSettings(values: UpdateSiteSettingsDto) {
	const serviceResult = await SiteSettingsService.updateSiteSettings(values);

	revalidatePath('/', 'layout');

	return serviceResult.toPlainObject();
}
