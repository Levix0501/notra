import { z } from 'zod';

export const CreateBookFormSchema = z.object({
	name: z.string()
});

export type CreateBookFormValues = z.infer<typeof CreateBookFormSchema>;
