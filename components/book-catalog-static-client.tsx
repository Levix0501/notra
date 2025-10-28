'use client';

import { TreeNodeType } from '@prisma/client';
import { ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { create } from 'zustand';

import { cn } from '@/lib/utils';
import { ChildrenProps } from '@/types/common';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { Button } from './ui/button';

type BookCatalogStaticAsideStore = {
	mobileOpen: boolean;
	toggleMobileOpen: () => void;
};

export const useBookCatalogStaticAside = create<BookCatalogStaticAsideStore>(
	(set) => ({
		mobileOpen: false,
		toggleMobileOpen: () => set((state) => ({ mobileOpen: !state.mobileOpen }))
	})
);

export function BookCatalogStaticAside({ children }: Readonly<ChildrenProps>) {
	const mobileOpen = useBookCatalogStaticAside((state) => state.mobileOpen);

	return (
		<aside
			className={cn(
				'fixed top-0 bottom-0 left-0 z-45 w-80 translate-x-[-100%] overscroll-contain bg-background opacity-0 transition-[translate,opacity] duration-250 ease-[ease] md:sticky md:top-20 md:z-30 md:h-[calc(100dvh-80px)] md:w-64 md:shrink-0 md:translate-x-0 md:opacity-100',
				mobileOpen && 'translate-x-0 opacity-100'
			)}
		>
			{children}
		</aside>
	);
}

export function BookCatalogStaticBackdrop() {
	const mobileOpen = useBookCatalogStaticAside((state) => state.mobileOpen);
	const toggleMobileOpen = useBookCatalogStaticAside(
		(state) => state.toggleMobileOpen
	);

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

export function BookCatalogStaticTrigger() {
	const toggleMobileOpen = useBookCatalogStaticAside(
		(state) => state.toggleMobileOpen
	);

	return (
		<Button variant="ghost" onClick={toggleMobileOpen}>
			<Menu />
		</Button>
	);
}

interface BookCatalogStaticContentProps {
	bookSlug: string;
	treeNodes: TreeNodeVoWithLevel[];
}

export const BookCatalogStaticContent = ({
	bookSlug,
	treeNodes
}: Readonly<BookCatalogStaticContentProps>) => {
	const [expandedKeys, setExpandedKeys] = useState(
		new Set(treeNodes.filter((node) => node.level === 0).map((node) => node.id))
	);
	const items = useMemo(() => {
		return treeNodes.filter(
			(node) =>
				node.level === 0 || (node.parentId && expandedKeys.has(node.parentId))
		);
	}, [treeNodes, expandedKeys]);

	const pathname = usePathname();

	const toggleExpandedKey = (key: number) => {
		setExpandedKeys((prev) => {
			const newExpandedKeys = new Set(prev);

			if (newExpandedKeys.has(key)) {
				newExpandedKeys.delete(key);
			} else {
				newExpandedKeys.add(key);
			}

			return newExpandedKeys;
		});
	};

	const renderItem = (item: TreeNodeVoWithLevel) => {
		return (
			<>
				<div className="mr-1 size-6">
					{item.childId !== null && (
						<Button
							className="size-6 hover:bg-border"
							size="icon"
							variant="ghost"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								toggleExpandedKey(item.id);
							}}
						>
							<ChevronRight
								className={cn(
									'transition-transform duration-200',
									expandedKeys.has(item.id) && 'rotate-90'
								)}
								size={16}
							/>
						</Button>
					)}
				</div>
				<div className="flex-1 truncate select-none">{item.title}</div>
			</>
		);
	};

	return items.map((item) =>
		item.type === TreeNodeType.GROUP ? (
			<div
				key={item.id}
				className={cn(
					'my-px flex h-[34px] cursor-pointer items-center rounded-md pr-1.5 text-sm hover:bg-sidebar-accent'
				)}
				style={{ paddingLeft: 24 * item.level + 'px' }}
				onClick={() => {
					toggleExpandedKey(item.id);
				}}
			>
				{renderItem(item)}
			</div>
		) : (
			<Link
				key={item.id}
				className={cn(
					'my-px flex h-[34px] items-center rounded-md pr-1.5 text-sm hover:bg-sidebar-accent',
					pathname === `/${bookSlug}/${item.url}` &&
						'bg-sidebar-accent font-bold'
				)}
				href={`/${bookSlug}/${item.url}`}
				style={{ paddingLeft: 24 * item.level + 'px' }}
			>
				{renderItem(item)}
			</Link>
		)
	);
};
