'use client';

import { useEffect } from 'react';

import { useIsMobile } from '@/hooks/use-is-mobile';
import { cn } from '@/lib/utils';

import { useNotraSidebar } from './notra-sidebar';

export function NotraBackdrop() {
	const isMobile = useIsMobile();
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const toggleMobileOpen = useNotraSidebar((state) => state.toggleMobileOpen);

	useEffect(() => {
		if (isMobile) {
			if (mobileOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.removeProperty('overflow');
			}
		}
	}, [isMobile, mobileOpen]);

	const handleClick = () => {
		toggleMobileOpen();
	};

	return (
		<div
			className={cn(
				'invisible fixed top-0 right-0 bottom-0 left-0 z-40 bg-black/45 opacity-0 transition-[visibility,opacity] duration-250 ease-[ease]',
				mobileOpen && 'visible opacity-100 md:invisible md:opacity-0'
			)}
			onClick={handleClick}
		></div>
	);
}
