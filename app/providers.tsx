import { ThemeProvider } from '@/components/theme-provider';

export default function Providers({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ThemeProvider
			disableTransitionOnChange
			enableSystem
			attribute="class"
			defaultTheme="system"
		>
			{children}
		</ThemeProvider>
	);
}
