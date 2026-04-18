import { Prisma } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt-ts';

import { signIn } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { LoginDto } from '@/types/auth';

export class AccountService {
	static async hasAnyUser(): Promise<boolean> {
		try {
			const count = await prisma.user.count();

			return count > 0;
		} catch (error) {
			logger('AccountService.hasAnyUser', error);

			return false;
		}
	}

	static async findUserByUsername(username: string) {
		try {
			const user = await prisma.user.findUnique({
				where: { username }
			});

			return ServiceResult.success(user);
		} catch (error) {
			logger('AccountService.findUserByUsername', error);
			const t = getTranslations('services_account');

			return ServiceResult.fail(t.get_account_error);
		}
	}

	/** First bootstrap user becomes site administrator. */
	static async createFirstAdmin(username: string, password: string) {
		const salt = genSaltSync(10);
		const hashedPassword = hashSync(password, salt);

		try {
			const user = await prisma.user.create({
				data: {
					username,
					password: hashedPassword,
					role: 'ADMIN'
				}
			});

			return ServiceResult.success(user);
		} catch (error) {
			logger('AccountService.createFirstAdmin', error);
			const t = getTranslations('services_account');

			return ServiceResult.fail(t.create_account_error);
		}
	}

	static async updateUserImage(userId: string, imageUrl: string | null) {
		const t = getTranslations('services_account');
		const id = typeof userId === 'string' ? userId.trim() : '';

		if (!id) {
			return ServiceResult.fail(t.update_user_image_invalid_session);
		}

		try {
			const existing = await prisma.user.findUnique({
				where: { id },
				select: { id: true }
			});

			if (!existing) {
				return ServiceResult.fail(t.update_user_image_user_not_found);
			}

			const user = await prisma.user.update({
				where: { id },
				data: { image: imageUrl }
			});

			return ServiceResult.success(user);
		} catch (error) {
			logger('AccountService.updateUserImage', error);

			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				return ServiceResult.fail(t.update_user_image_user_not_found);
			}

			return ServiceResult.fail(t.get_account_error);
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
