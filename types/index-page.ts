import { z } from 'zod';

export const IndexPageFormSchema = z.object({
	indexTitle: z.string().optional(),
	indexDescription: z.string().optional(),
	mainActionText: z.string().optional(),
	mainActionUrl: z.string().optional(),
	isMainNewTab: z.boolean(),
	subActionText: z.string().optional(),
	subActionUrl: z.string().optional(),
	isSubNewTab: z.boolean()
});

export type IndexPageFormValues = z.infer<typeof IndexPageFormSchema>;
