import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import FileService from '@/services/file';

export async function POST(request: Request) {
	const session = await auth();

	if (!session) {
		const t = getTranslations('app_api');

		return ServiceResult.fail(t.unauthorized).nextResponse({
			status: 401
		});
	}

	const formData = await request.formData();
	const file = formData.get('file') as File;
	const serviceResult = await FileService.uploadFile(file);

	return serviceResult.nextResponse();
}
