import { BookEntity, DocEntity, SiteSettingsEntity } from '@prisma/client';
import { z } from 'zod';

export type SiteSettingsVo = Omit<
	SiteSettingsEntity,
	'id' | 'createdAt' | 'updatedAt'
> & {
	redirectToBook: {
		slug: BookEntity['slug'];
		isPublished: BookEntity['isPublished'];
	};
	redirectToDoc: {
		slug: DocEntity['slug'];
		isPublished: DocEntity['isPublished'];
		isDeleted: DocEntity['isDeleted'];
		book: {
			slug: BookEntity['slug'];
			isPublished: BookEntity['isPublished'];
		};
	};
};

type UpdateSiteSettingsVo = Omit<
	SiteSettingsEntity,
	'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateSiteSettingsDto = {
	[key in keyof UpdateSiteSettingsVo]?: UpdateSiteSettingsVo[key];
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

export const HomePageRedirectFormSchema = z.object({
	homePageRedirectType: z.enum(['BOOK', 'DOC', 'PAGE', 'NONE']),
	redirectToBookId: z.number().nullable(),
	redirectToDocId: z.number().nullable()
});

export type HomePageRedirectFormValues = z.infer<
	typeof HomePageRedirectFormSchema
>;
