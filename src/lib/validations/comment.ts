import { z } from 'zod';

import { CreateCommentDto } from '@/types/comment';

const emptyHoneypotSchema = z
	.string()
	.trim()
	.max(0, { message: 'Spam detected.' })
	.nullish();

export const CreateCommentSchema = z.object({
	content: z.string().trim().min(1).max(5000),
	authorName: z.string().trim().min(1).max(100),
	authorEmail: z.string().trim().email().max(254),
	authorWebsite: z
		.string()
		.trim()
		.url()
		.max(2048)
		.optional()
		.or(z.literal('')),
	honeypot: emptyHoneypotSchema,
	parentId: z.number().int().positive().nullable().optional()
}) satisfies z.ZodType<CreateCommentDto>;

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
