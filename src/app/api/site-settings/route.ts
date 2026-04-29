import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import { SiteSettingsService } from '@/services/site-settings';

export async function GET() {
	const session = await auth();

	if (!session) {
		const t = getTranslations('app_api');

		return ServiceResult.fail(t.unauthorized).nextResponse({
			status: 401
		});
	}

	const result = await SiteSettingsService.getSiteSettings();

	return result.nextResponse();
}
