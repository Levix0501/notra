import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';

import { AppRevalidator } from '@/components/app-revalidator';
import { ClientEnvInjector } from '@/components/client-env-injector';
import { GoogleAnalytics } from '@/components/google-analytics';
import { RootProviders } from '@/components/root-providers';
import {
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK,
	DEFAULT_SITE_TITLE
} from '@/constants';
import { ENV_LOCALE } from '@/constants/env';
import { SiteSettingsService } from '@/services/site-settings';

import type { Metadata } from 'next';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
});

export const generateMetadata = async (): Promise<Metadata> => {
	const metadataBase = new URL(
		process.env.AUTH_URL?.replace(/\/$/, '') ?? 'https://localhost'
	);

	// During `next build` (e.g. Docker builder stage), DATABASE_URL is usually not set.
	// Avoid DB calls so the build can prerender pages safely.
	if (!process.env.DATABASE_URL) {
		return {
			metadataBase,
			title: {
				template: `%s - ${DEFAULT_SITE_TITLE}`,
				default: DEFAULT_SITE_TITLE
			},
			description: '',
			icons: {
				icon: [
					{
						media: '(prefers-color-scheme: light)',
						url: DEFAULT_SITE_LOGO
					},
					{
						media: '(prefers-color-scheme: dark)',
						url: DEFAULT_SITE_LOGO_DARK
					}
				]
			}
		};
	}

	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return {
		metadataBase,
		title: {
			template: `%s - ${siteSettings?.title ?? DEFAULT_SITE_TITLE}`,
			default: siteSettings?.title ?? DEFAULT_SITE_TITLE
		},
		description: siteSettings?.description ?? '',
		icons: {
			icon: [
				{
					media: '(prefers-color-scheme: light)',
					url: siteSettings?.logo ?? siteSettings?.darkLogo ?? DEFAULT_SITE_LOGO
				},
				{
					media: '(prefers-color-scheme: dark)',
					url:
						siteSettings?.darkLogo ??
						siteSettings?.logo ??
						DEFAULT_SITE_LOGO_DARK
				}
			]
		}
	};
};

export const revalidate = 31536000; // 1 year

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning lang={ENV_LOCALE}>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<ClientEnvInjector />
				<AppRevalidator />
				<RootProviders>
					<Toaster richColors position="bottom-right" />
					{children}
				</RootProviders>
			</body>
			<GoogleAnalytics />
		</html>
	);
}
