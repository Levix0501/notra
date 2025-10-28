import { Bot } from 'lucide-react';

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
