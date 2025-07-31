import { genSaltSync, hashSync } from 'bcrypt-ts';

import { signIn } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { LoginDto } from '@/types/auth';

export class AccountService {
	static async getAccount() {
		try {
			const account = await prisma.accountEntity.findUnique({
				where: { id: 'default' }
			});

			return ServiceResult.success(account);
		} catch (error) {
			logger('AccountService.getAccount', error);
			const t = getTranslations('services_account');

			return ServiceResult.fail(t.get_account_error);
		}
	}

	static async createAccount(username: string, password: string) {
		const salt = genSaltSync(10);
		const hashedPassword = hashSync(password, salt);

		try {
			const account = await prisma.accountEntity.create({
				data: { id: 'default', username, password: hashedPassword }
			});

			return ServiceResult.success(account);
		} catch (error) {
			logger('AccountService.createAccount', error);
			const t = getTranslations('services_account');

			return ServiceResult.fail(t.create_account_error);
		}
	}

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
