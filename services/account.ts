import { signIn } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import { ServiceResult } from '@/lib/service-result';
import { LoginDto } from '@/types/auth';

export class AccountService {
	static async login({ username, password }: LoginDto) {
		try {
			await signIn('credentials', {
				username,
				password,
				redirect: false
			});

			return ServiceResult.success(null);
		} catch (error) {
			logger('AccountService.login', error);
			const t = getTranslations('services_account');

			return ServiceResult.fail(t.login_error);
		}
	}
}
