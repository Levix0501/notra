'use client';

import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from '@/components/theme-provider';
import { AppProvider } from '@/contexts/app-context';

/** Wraps the entire app: Auth (session), theme, and demo/live app context. */
export function RootProviders({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SessionProvider>
			<ThemeProvider
				disableTransitionOnChange
				enableSystem
				attribute="class"
				defaultTheme="system"
			>
				<AppProvider isDemo={false}>{children}</AppProvider>
			</ThemeProvider>
		</SessionProvider>
	);
}
