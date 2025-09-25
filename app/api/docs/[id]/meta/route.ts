import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import DocService from '@/services/doc';

export async function GET(
	_: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = await auth();

	if (!session) {
		const t = getTranslations('app_api');

		return ServiceResult.fail(t.unauthorized).nextResponse({
			status: 401
		});
	}

	const { id } = await params;
	const result = await DocService.getDocMeta(Number(id));

	return result.nextResponse();
}
