import { getTranslations } from '@/i18n';

const t = getTranslations('components_notra_footer');

export default async function NotraFooter() {
	return (
		<footer className="p-6 text-center text-xs leading-5 text-muted-foreground">
			<h2 className="sr-only">Footer</h2>
			<p
				dangerouslySetInnerHTML={{
					__html: t.powered_by
				}}
			></p>
		</footer>
	);
}
