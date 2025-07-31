import { z } from 'zod';

import { getTranslations } from '@/i18n';

export const LoginFormSchema = z.object({
	username: z.string().min(1, {
		message: getTranslations('components_login_form').username_required
	}),
	password: z.string().min(6, {
		message: getTranslations('components_login_form').password_min_length
	})
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;

export type LoginDto = LoginFormValues;
