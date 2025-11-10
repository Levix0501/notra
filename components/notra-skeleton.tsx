import { Skeleton } from './ui/skeleton';

export function NotraSkeleton() {
	return (
		<div className="px-2">
			<div className="py-2.5">
				<Skeleton className="h-4" />
			</div>
			<div className="py-2.5">
				<Skeleton className="h-4" />
			</div>
			<div className="py-2.5">
				<Skeleton className="h-4" />
			</div>
		</div>
	);
}
