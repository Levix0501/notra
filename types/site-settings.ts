import { SiteSettingsEntity } from '@prisma/client';
import { z } from 'zod';

export type SiteSettingsVo = Omit<
	SiteSettingsEntity,
	'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateSiteSettingsDto = {
	[key in keyof SiteSettingsVo]?: SiteSettingsVo[key];
};

export const SiteSettingsFormSchema = z.object({
	title: z.string(),
	description: z.string(),
	logo: z.instanceof(File).nullable().optional(),
	darkLogo: z.instanceof(File).nullable().optional(),
	copyright: z.string()
});

export type SiteSettingsFormValues = z.infer<typeof SiteSettingsFormSchema>;

export const AnalyticsFormSchema = z.object({
	gaId: z.string().optional()
});

export type AnalyticsFormValues = z.infer<typeof AnalyticsFormSchema>;
