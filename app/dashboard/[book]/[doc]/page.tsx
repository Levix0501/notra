import { NotraInsetHeader } from '@/components/notra-sidebar';
import { ThemeChanger } from '@/components/theme-changer';

export default function Page() {
	return (
		<>
			<NotraInsetHeader>
				<div className="flex size-full items-center justify-between">
					<span></span>

					<ThemeChanger />
				</div>
			</NotraInsetHeader>

			<main className="container mx-auto p-4 md:p-8">doc page</main>
		</>
	);
}
