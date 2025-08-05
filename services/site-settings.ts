import { cache } from 'react';

import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { UpdateSiteSettingsDto } from '@/types/site-settings';

export default class SiteSettingsService {
	static readonly getSiteSettings = cache(async () => {
		try {
			let siteSettings = await prisma.siteSettingsEntity.findUnique({
				where: { id: 'default' },
				omit: {
					id: true,
					createdAt: true,
					updatedAt: true
				}
			});

			siteSettings ??= await prisma.siteSettingsEntity.create({
				data: {
					id: 'default'
				},
				omit: {
					id: true,
					createdAt: true,
					updatedAt: true
				}
			});

			return ServiceResult.success(siteSettings);
		} catch (error) {
			logger('SiteSettingsService.getSiteSettings', error);
			const t = getTranslations('services_site_settings');

			return ServiceResult.fail(t.get_site_settings_error);
		}
	});

	static readonly updateSiteSettings = async (
		values: UpdateSiteSettingsDto
	) => {
		try {
			const siteSettings = await prisma.siteSettingsEntity.update({
				where: { id: 'default' },
				data: values
			});

			return ServiceResult.success(siteSettings);
		} catch (error) {
			logger('SiteSettingsService.updateSiteSettings', error);
			const t = getTranslations('services_site_settings');

			return ServiceResult.fail(t.update_site_settings_error);
		}
	};
}
