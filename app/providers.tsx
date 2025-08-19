import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from '@/components/theme-provider';

export default function Providers({
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
				{children}
			</ThemeProvider>
		</SessionProvider>
	);
}
