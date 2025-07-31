import { Metadata } from 'next';

import { LoginForm } from '@/components/login-form';
import NotraFooter from '@/components/notra-footer';
import NotraHeader from '@/components/notra-header';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { DEFAULT_SITE_TITLE } from '@/constants/default';
import { getTranslations } from '@/i18n';

const t = getTranslations('app_login_page');

export const generateMetadata = async (): Promise<Metadata> => {
	return {
		title: `${t.metadata_title} - ${DEFAULT_SITE_TITLE}`
	};
};

export default function Page() {
	return (
		<div className="flex min-h-dvh flex-col">
			<NotraHeader />

			<main className="flex flex-1 items-center justify-center">
				<Card className="w-sm">
					<CardHeader>
						<CardTitle>{t.card_title}</CardTitle>
						<CardDescription>{t.card_description}</CardDescription>
					</CardHeader>
					<CardContent>
						<LoginForm />
					</CardContent>
				</Card>
			</main>

			<NotraFooter />
		</div>
	);
}
