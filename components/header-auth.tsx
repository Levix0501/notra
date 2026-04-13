import Link from 'next/link';

import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';

import { Button } from './ui/button';

export async function HeaderAuthLinks() {
	const session = await auth();
	const t = getTranslations('components_header_auth');

	if (session?.user) {
		return null;
	}

	return (
		<Link href="/login">
			<Button size="sm" variant="ghost">
				{t.sign_in}
			</Button>
		</Link>
	);
}
