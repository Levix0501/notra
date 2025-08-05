import { Ghost } from 'lucide-react';

export interface EmptyStateProps {
	content: string;
}

export default function EmptyState({ content }: Readonly<EmptyStateProps>) {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
			<Ghost size={48} />

			<p className="mt-2 text-lg font-medium">{content}</p>
		</div>
	);
}
