'use client';

import { LucideIcon, PanelLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { MouseEventHandler, useRef } from 'react';
import { create } from 'zustand';

import { useIsMobile } from '@/hooks/use-is-mobile';
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

export function NotraSidebar({ children }: Readonly<ChildrenProps>) {
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
				'group/sidebar fixed top-0 bottom-0 left-0 z-50 w-80 translate-x-[-100%] overscroll-contain bg-sidebar opacity-0 transition-[translate,opacity] duration-250 ease-[ease] md:w-(--sidebar-width,256px) md:translate-x-0 md:opacity-100',
				mobileOpen &&
					'translate-x-0 opacity-100 md:translate-x-[-100%] md:opacity-0'
			)}
		>
			<button
				aria-label="Resize Sidebar"
				className={cn(
					'invisible absolute top-0 -right-1.5 h-full w-1.5 after:absolute after:top-0 after:right-1.5 after:bottom-0 after:w-px after:bg-sidebar-accent after:transition-colors group-data-[resizing=true]/sidebar:after:bg-sidebar-border md:visible',
					'md:cursor-col-resize md:hover:after:bg-sidebar-border'
				)}
				onMouseDown={handleMouseDown}
			/>
			<nav className="flex size-full flex-col">{children}</nav>
		</aside>
	);
}

export function NotraInset({ children }: Readonly<ChildrenProps>) {
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

export function NotraInsetHeader({ children }: Readonly<ChildrenProps>) {
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const isResizing = useNotraSidebar((state) => state.isResizing);

	return (
		<header
			className={cn(
				'fixed top-0 right-0 left-0 z-30 h-14 border-b border-accent bg-background px-4 md:left-(--sidebar-width,256px)',
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
			className={'-ml-1 cursor-pointer'}
			size="icon"
			variant="ghost"
			onClick={handleClick}
		>
			<PanelLeftIcon />
			<span className="sr-only">Toggle Sidebar</span>
		</Button>
	);
}

export function NotraSidebarContent({ children }: Readonly<ChildrenProps>) {
	return <div className="flex flex-1 flex-col overflow-hidden">{children}</div>;
}

export function NotraSidebarMenu({ children }: Readonly<ChildrenProps>) {
	return <ul className="px-4 md:px-2.5">{children}</ul>;
}

export function NotraSidebarMenuItem({ children }: Readonly<ChildrenProps>) {
	return <li className="group/menu-item relative h-9">{children}</li>;
}

export interface NotraSidebarButtonProps extends ChildrenProps {
	href?: string;
	className?: string;
	isActive?: boolean;
	onClick?: () => void;
}

export function NotraSidebarButton({
	children,
	href = '#',
	className,
	isActive,
	onClick
}: Readonly<NotraSidebarButtonProps>) {
	const isMobile = useIsMobile();
	const toggleSidebar = useNotraSidebar((state) => state.toggleMobileOpen);

	const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
		if (isMobile) {
			toggleSidebar();
		}

		if (onClick) {
			e.preventDefault();
			onClick();
		}
	};

	return (
		<Link
			className={cn(
				'my-px flex h-[34px] w-full items-center gap-2 rounded-sm border-[1.5px] border-transparent px-1 text-sm text-secondary-foreground transition-colors',
				className,
				isActive
					? 'bg-sidebar-accent'
					: 'hover:bg-sidebar-accent md:has-[[data-state=open]]:bg-sidebar-accent'
			)}
			href={href}
			onClick={handleClick}
		>
			{children}
		</Link>
	);
}
