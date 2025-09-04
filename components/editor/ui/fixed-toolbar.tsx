'use client';

import { useNotraSidebar } from '@/components/notra-sidebar';
import { cn } from '@/lib/utils';
import { ChildrenProps } from '@/types/common';

export const FixedToolbar = ({ children }: ChildrenProps) => {
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const isResizing = useNotraSidebar((state) => state.isResizing);

	return (
		<div
			className={cn(
				'fixed top-14 right-0 left-0 z-30 h-11 border-b border-accent bg-background md:left-(--sidebar-width,256px)',
				mobileOpen && 'md:left-0',
				!isResizing && 'transition-[left] duration-250 ease-[ease]'
			)}
		>
			<div className="flex size-full items-center px-2">{children}</div>
		</div>
	);
};
