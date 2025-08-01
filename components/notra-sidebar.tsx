'use client';

import { LucideIcon, PanelLeftIcon } from 'lucide-react';
import { MouseEventHandler, useRef } from 'react';
import { create } from 'zustand';

import { cn } from '@/lib/utils';
import { ChildrenProps } from '@/types/common';

import { Button } from './ui/button';

type NotraSidebarStore = {
	mobileOpen: boolean;
	toggleMobileOpen: () => void;
	isResizing: boolean;
	setIsResizing: (isResizing: boolean) => void;
};

export const useNotraSidebar = create<NotraSidebarStore>((set) => ({
	mobileOpen: false,
	toggleMobileOpen: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
	isResizing: false,
	setIsResizing: (isResizing) => set({ isResizing })
}));

export interface SidebarNavItem {
	title: string;
	url: string;
	icon?: LucideIcon;
	subItems?: SidebarNavItem[];
}

export interface NotraSidebarProps extends ChildrenProps {
	resizable?: boolean;
	className?: string;
}

export function NotraSidebar({
	children,
	resizable = false,
	className
}: Readonly<NotraSidebarProps>) {
	const sidebarRef = useRef<HTMLElement>(null);
	const bodyCursor = useRef('');
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const setIsResizing = useNotraSidebar((state) => state.setIsResizing);

	const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.stopPropagation();
		e.preventDefault();

		setIsResizing(true);
		sidebarRef.current?.setAttribute('data-resizing', 'true');

		bodyCursor.current = document.body.style.cursor;
		document.body.style.cursor = 'col-resize';

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (event: MouseEvent) => {
		let newWidth = event.clientX;

		if (newWidth < 256) newWidth = 256;

		if (newWidth > 480) newWidth = 480;

		document.documentElement.style.setProperty(
			'--sidebar-width',
			`${newWidth}px`
		);
	};

	const handleMouseUp = () => {
		setIsResizing(false);
		sidebarRef.current?.removeAttribute('data-resizing');

		document.body.style.cursor = bodyCursor.current;

		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	};

	return (
		<aside
			ref={sidebarRef}
			className={cn(
				'group/sidebar fixed top-0 bottom-0 left-0 z-50 w-80 translate-x-[-100%] overscroll-contain bg-[#fafafa] opacity-0 transition-[translate,opacity] duration-250 ease-[ease] md:w-(--sidebar-width,256px) md:translate-x-0 md:opacity-100 dark:bg-[#1f1f1f]',
				mobileOpen &&
					'translate-x-0 opacity-100 md:translate-x-[-100%] md:opacity-0',
				className
			)}
		>
			<button
				aria-label="Resize Sidebar"
				className={cn(
					'invisible absolute top-0 -right-1.5 h-full w-1.5 after:absolute after:top-0 after:right-1.5 after:bottom-0 after:w-px after:bg-[#eff0f0] after:transition-colors group-data-[resizing=true]/sidebar:after:bg-[#e7e9e8] md:visible dark:after:bg-[#292929] dark:group-data-[resizing=true]/sidebar:after:bg-[#333]',
					resizable &&
						'md:cursor-col-resize md:hover:after:bg-[#e7e9e8] dark:md:hover:after:bg-[#333]'
				)}
				onMouseDown={resizable ? handleMouseDown : void 0}
			/>
			<nav className="flex size-full flex-col">{children}</nav>
		</aside>
	);
}

export type NotraInsetProps = ChildrenProps;

export function NotraInset({ children }: Readonly<NotraInsetProps>) {
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const isResizing = useNotraSidebar((state) => state.isResizing);

	return (
		<div
			className={cn(
				'size-full pt-14 md:pl-(--sidebar-width,256px)',
				mobileOpen && 'md:pl-0',
				!isResizing && 'transition-[padding-left] duration-250 ease-[ease]'
			)}
		>
			{children}
		</div>
	);
}

export type NotraInsetHeaderProps = ChildrenProps;

export function NotraInsetHeader({
	children
}: Readonly<NotraInsetHeaderProps>) {
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const isResizing = useNotraSidebar((state) => state.isResizing);

	return (
		<header
			className={cn(
				'fixed top-0 right-0 left-0 z-30 h-14 border-b border-border-light bg-background px-4 md:left-(--sidebar-width,256px)',
				mobileOpen && 'md:left-0',
				!isResizing && 'transition-[left] duration-250 ease-[ease]'
			)}
		>
			<div className="flex size-full items-center gap-2">
				<NotraSidebarTrigger />
				{children}
			</div>
		</header>
	);
}

export function NotraSidebarTrigger() {
	const toggleMobileOpen = useNotraSidebar((state) => state.toggleMobileOpen);

	const handleClick = () => {
		toggleMobileOpen();
	};

	return (
		<Button
			className={'-ml-1 size-7 cursor-pointer'}
			size="icon"
			variant="ghost"
			onClick={handleClick}
		>
			<PanelLeftIcon />
			<span className="sr-only">Toggle Sidebar</span>
		</Button>
	);
}
