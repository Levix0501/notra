import { NotFoundEmptyState } from '@/components/empty-state';

export default function NotFound() {
	return (
		<div className="flex h-[60dvh] items-center justify-center">
			<NotFoundEmptyState />
		</div>
	);
}
