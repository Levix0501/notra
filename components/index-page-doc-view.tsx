import Link from 'next/link';

import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';

export interface IndexPageDocViewProps {
	className?: string;
	indexTitle: string;
	indexDescription: string;
	mainActionText: string;
	mainActionUrl: string;
	isMainNewTab: boolean;
	subActionText: string;
	subActionUrl: string;
	isSubNewTab: boolean;
}

const t = getTranslations('components_index_page_doc_view');

export default function IndexPageDocView({
	className,
	indexTitle,
	indexDescription,
	mainActionText,
	mainActionUrl,
	subActionText,
	subActionUrl,
	isMainNewTab,
	isSubNewTab
}: Readonly<IndexPageDocViewProps>) {
	return (
		<div
			className={cn(
				'mx-auto max-w-96 pt-12 sm:max-w-[576px] md:max-w-[592px] md:pt-36',
				className
			)}
		>
			<h1 className="text-center text-4xl font-bold sm:text-5xl md:text-6xl">
				{indexTitle || t.no_index_title}
			</h1>

			<p className="pt-2 text-center text-lg font-medium text-muted-foreground sm:pt-3 sm:text-xl md:text-2xl">
				{indexDescription || t.no_index_description}
			</p>

			<div className="flex justify-center pt-6 sm:pt-8">
				<div className="p-1.5">
					<Link href={mainActionUrl} target={isMainNewTab ? '_blank' : '_self'}>
						<Button className="h-10 cursor-pointer rounded-full px-5">
							{mainActionText || t.no_main_action_text}
						</Button>
					</Link>
				</div>

				<div className="p-1.5">
					<Link href={subActionUrl} target={isSubNewTab ? '_blank' : '_self'}>
						<Button
							className="h-10 cursor-pointer rounded-full bg-[#ebebef] px-5 hover:bg-[#e4e4e9] dark:bg-[#32363f] dark:hover:bg-[#414853]"
							variant="secondary"
						>
							{subActionText || t.no_sub_action_text}
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
