import {
	ArrowUpRight,
	BookOpen,
	Code2,
	Database,
	FileText,
	Palette,
	Smartphone,
	Github
} from 'lucide-react';
import Link from 'next/link';

import { TryItButton } from '@/components/try-it-button';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { GITHUB_URL } from '@/constants';
import { getTranslations } from '@/i18n';

export default function Page() {
	const t = getTranslations('app_demo_page');

	const features = [
		{
			icon: BookOpen,
			title: t.feature_knowledge_management,
			description: t.feature_knowledge_management_desc
		},
		{
			icon: FileText,
			title: t.feature_rich_editor,
			description: t.feature_rich_editor_desc
		},
		{
			icon: Code2,
			title: t.feature_tree_structure,
			description: t.feature_tree_structure_desc
		},
		{
			icon: Database,
			title: t.feature_quick_setup,
			description: t.feature_quick_setup_desc
		},
		{
			icon: Palette,
			title: t.feature_theme_switch,
			description: t.feature_theme_switch_desc
		},
		{
			icon: Smartphone,
			title: t.feature_responsive,
			description: t.feature_responsive_desc
		}
	];

	return (
		<>
			<div className="absolute inset-x-0 top-0 z-[-1] h-[70vh] overflow-hidden mask-[linear-gradient(white,transparent)]">
				<svg className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/2 stroke-black/5 dark:fill-white/2 dark:stroke-white/5">
					<defs>
						<pattern
							height="56"
							id="tilted-grid_svg__pt"
							patternUnits="userSpaceOnUse"
							width="72"
							x="50%"
							y="16"
						>
							<path d="M.5 56V.5H72" fill="none"></path>
						</pattern>
					</defs>
					<rect
						fill="url(#tilted-grid_svg__pt)"
						height="100%"
						strokeWidth="0"
						width="100%"
					></rect>
					<svg
						className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/2 stroke-black/5 dark:fill-white/1 dark:stroke-white/2.5"
						x="50%"
						y="16"
					>
						<rect height="57" strokeWidth="0" width="73" x="0" y="56"></rect>
						<rect height="57" strokeWidth="0" width="73" x="72" y="168"></rect>
					</svg>
				</svg>
			</div>

			<main className="flex min-h-[calc(100dvh-var(--spacing-header-height))] flex-col">
				<div className="mx-auto flex max-w-screen-2xl flex-1 flex-col justify-center">
					<section className="flex flex-col items-center justify-center py-20 max-md:px-6 md:pb-24">
						<h1 className="w-full max-w-[50rem] text-center text-[max(2.5rem,min(4vw,4rem))] leading-[110%] font-semibold tracking-tight text-balance">
							{t.hero_title}
						</h1>
						<p className="mt-6 max-w-[29.5rem] text-center text-base/[150%] text-muted-foreground md:text-lg/[150%]">
							{t.hero_description}
						</p>
						<div className="mt-8 flex gap-4">
							<TryItButton label={t.try_demo} />

							<Link href="/docs" target="_blank">
								<Button size="lg" variant="outline">
									{t.view_docs}
									<ArrowUpRight />
								</Button>
							</Link>
						</div>
					</section>

					<section className="mx-auto mb-20 grid max-w-screen-xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
						{features.map((feature) => {
							const Icon = feature.icon;

							return (
								<Card
									key={feature.title}
									className="group relative overflow-hidden border-border/50 bg-background/60 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 dark:bg-slate-900/40"
								>
									<div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />

									<CardHeader>
										<div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
											<Icon className="h-6 w-6 text-primary transition-colors group-hover:text-white dark:group-hover:text-black" />
										</div>
										<CardTitle className="text-xl font-bold">
											{feature.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-sm leading-relaxed text-muted-foreground/80">
											{feature.description}
										</CardDescription>
									</CardContent>
								</Card>
							);
						})}
					</section>
				</div>

				<footer className="border-t border-accent py-9 text-center text-sm text-muted-foreground">
					<p>© {new Date().getFullYear()} Notra</p>
					<div className="mt-2 flex justify-center gap-6">
						<Link
							className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
							href={GITHUB_URL}
							rel="noopener noreferrer"
							target="_blank"
						>
							<Github className="size-4" />
							{t.footer_github}
						</Link>
						<Link
							className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
							href="/docs"
							target="_blank"
						>
							<FileText className="size-4" />
							{t.footer_docs}
						</Link>
					</div>
				</footer>
			</main>
		</>
	);
}
