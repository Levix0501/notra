import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import { ServiceResult } from '@/lib/service-result';
import storage from '@/lib/storage';
import { encryptFileMD5 } from '@/lib/utils';
import { AccountService } from '@/services/account';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
	const session = await auth();
	const t = getTranslations('app_api');
	const tAccount = getTranslations('services_account');

	const userId =
		typeof session?.user?.id === 'string' ? session.user.id.trim() : '';

	if (!userId) {
		return ServiceResult.fail(t.unauthorized).nextResponse({
			status: 401
		});
	}

	let formData: FormData;

	try {
		formData = await request.formData();
	} catch {
		return ServiceResult.fail(t.bad_request).nextResponse({ status: 400 });
	}

	const file = formData.get('file');

	if (!(file instanceof File)) {
		return ServiceResult.fail(t.avatar_no_file).nextResponse({ status: 400 });
	}

	if (!file.type.startsWith('image/')) {
		return ServiceResult.fail(t.avatar_invalid_type).nextResponse({
			status: 400
		});
	}

	if (file.size > MAX_AVATAR_BYTES) {
		return ServiceResult.fail(t.avatar_too_large).nextResponse({
			status: 400
		});
	}

	try {
		const buffer = Buffer.from(await file.arrayBuffer());
		const hash = encryptFileMD5(buffer);
		const nameParts = file.name.split('.');
		const rawSuffix = nameParts.length >= 2 ? nameParts.pop() : 'jpg';
		const suffix =
			rawSuffix && /^[a-z0-9]+$/i.test(rawSuffix) ? rawSuffix : 'jpg';
		const objectPath = `avatars/${userId}/${hash}.${suffix}`;
		const uploadFile = new File([buffer], file.name, { type: file.type });
		const imageUrl = await storage.upload(uploadFile, objectPath);

		const updateResult = await AccountService.updateUserImage(userId, imageUrl);

		if (!updateResult.success || !updateResult.data) {
			const msg = updateResult.message || t.avatar_save_error;
			const sessionStale =
				msg === tAccount.update_user_image_user_not_found ||
				msg === tAccount.update_user_image_invalid_session;

			return ServiceResult.fail(msg).nextResponse({
				status: sessionStale ? 401 : 500
			});
		}

		return ServiceResult.success(
			{ image: imageUrl },
			t.avatar_save_success
		).nextResponse({
			status: 200
		});
	} catch (error) {
		logger('POST /api/user/avatar', error);

		return ServiceResult.fail(t.avatar_save_error).nextResponse({
			status: 500
		});
	}
}
