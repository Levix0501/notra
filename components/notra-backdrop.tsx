'use client';

import { cn } from '@/lib/utils';

import { useNotraSidebar } from './notra-sidebar';

export default function NotraBackdrop() {
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const toggleMobileOpen = useNotraSidebar((state) => state.toggleMobileOpen);

	const handleClick = () => {
		toggleMobileOpen();
	};

	return (
		<button
			className={cn(
				'invisible fixed top-0 right-0 bottom-0 left-0 z-40 bg-black/45 opacity-0 transition-[visibility,opacity] duration-250 ease-[ease]',
				mobileOpen && 'visible opacity-100 md:invisible md:opacity-0'
			)}
			onClick={handleClick}
		></button>
	);
}
