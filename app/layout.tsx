import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';

import GoogleAnalytics from '@/components/google-analytics';
import {
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK,
	DEFAULT_SITE_TITLE
} from '@/constants/default';
import { ENV_LOCALE } from '@/constants/env';
import SiteSettingsService from '@/services/site-settings';

import Providers from './providers';

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
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return {
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
				<Providers>
					<Toaster richColors position="top-right" />
					{children}
				</Providers>
			</body>
			<GoogleAnalytics />
		</html>
	);
}
