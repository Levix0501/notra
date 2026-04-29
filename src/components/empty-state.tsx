import { Bot, HomeIcon } from 'lucide-react';
import Link from 'next/link';

import { getTranslations } from '@/i18n';

import { Button } from './ui/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle
} from './ui/empty';

const t = getTranslations('components_empty_state');

export interface EmptyStateProps {
	content: string;
}

export function EmptyState({ content }: Readonly<EmptyStateProps>) {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
			<Bot size={48} />

			<p className="mt-2 text-lg font-bold">{content}</p>
		</div>
	);
}

export const NotFoundEmptyState = () => {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyTitle>{t.not_found}</EmptyTitle>
				<EmptyDescription>{t.not_found_description}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Link href="/">
					<Button size="sm" variant="outline">
						<HomeIcon /> {t.go_to_home}
					</Button>
				</Link>
			</EmptyContent>
		</Empty>
	);
};
