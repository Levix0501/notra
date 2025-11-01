import Script from 'next/script';

/**
 * Bridges server-side environment variables to the client at runtime.
 * This is useful when deploying pre-built artifacts (e.g., Docker images),
 * where NEXT_PUBLIC_* variables cannot be modified after the build phase.
 *
 * The component reads values from `process.env` on the server and injects
 * them into `window.__ENV__` for client-side access.
 *
 * On platforms like Vercel or other build-time deployment environments,
 * this component is usually unnecessary since environment variables are
 * automatically injected during the build process.
 */
export const ClientEnvInjector = () => {
	return (
		// eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
		<Script id="client-env-injector" strategy="beforeInteractive">
			{`window.__ENV__ = {LOCALE: '${process.env.NEXT_PUBLIC_LOCALE}',REVALIDATE: ${process.env.BUILDER}};`}
		</Script>
	);
};
