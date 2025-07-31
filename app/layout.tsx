import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';

import {
	DEFAULT_SITE_DESCRIPTION,
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK,
	DEFAULT_SITE_TITLE
} from '@/constants/default';
import { ENV_LOCALE } from '@/constants/env';

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
	return {
		title: DEFAULT_SITE_TITLE,
		description: DEFAULT_SITE_DESCRIPTION,
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
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning lang={ENV_LOCALE}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
