'use client';

import { ArrowUpRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { create } from 'zustand';

import { cn } from '@/lib/utils';
import { NavItemVo } from '@/types/tree-node';

import { Button } from './ui/button';

type NavbarStaticMobileStore = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

const useNavbarStaticMobile = create<NavbarStaticMobileStore>((set) => ({
	isOpen: false,
	setIsOpen: (isOpen) => set({ isOpen })
}));

export const NavbarStaticMobileButton = () => {
	const isOpen = useNavbarStaticMobile((state) => state.isOpen);
	const setIsOpen = useNavbarStaticMobile((state) => state.setIsOpen);

	const handleClick = () => {
		setIsOpen(!isOpen);

		if (isOpen) {
			document.body.style.overflow = 'auto';
		} else {
			document.body.style.overflow = 'hidden';
		}
	};

	return (
		<Button
			className="h-full w-10 hover:bg-transparent md:hidden dark:hover:bg-transparent"
			size="icon"
			variant="ghost"
			onClick={handleClick}
		>
			<div className="relative h-3.5 w-4 overflow-hidden">
				<div
					className={cn(
						'absolute left-0 h-0.5 w-4 rounded-full bg-foreground transition-all duration-250',
						isOpen ? 'top-1.5 rotate-225' : 'top-0'
					)}
				></div>
				<div
					className={cn(
						'absolute top-1.5 left-0 h-0.5 w-4 rounded-full bg-foreground transition-all duration-250',
						isOpen ? 'top-1.5 translate-x-4' : 'translate-x-2'
					)}
				></div>
				<div
					className={cn(
						'absolute left-0 h-0.5 w-4 rounded-full bg-foreground transition-all duration-250',
						isOpen ? 'top-1.5 translate-0 rotate-135' : 'top-3 translate-x-1'
					)}
				></div>
			</div>
		</Button>
	);
};

export const NavbarStaticMobile = ({ navItems }: { navItems: NavItemVo[] }) => {
	const [expandedKeys, setExpandedKeys] = useState(new Set<number>());

	const pathname = usePathname();
	const isOpen = useNavbarStaticMobile((state) => state.isOpen);

	const handleToggleExpandedKey = (key: number) => {
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

	return (
		<div
			className={cn(
				'fixed top-0 right-0 bottom-0 left-0 z-50 bg-background pr-4 pl-8',
				isOpen ? 'translate-y-14' : '-translate-y-full'
			)}
		>
			<div className="mx-auto max-w-72 py-6">
				<nav className="text-secondary-foreground">
					{navItems.map((item) =>
						item.children.length === 0 ? (
							<Link
								key={item.id}
								className={cn(
									'block py-3 leading-6 font-medium',
									pathname === item.url && 'text-primary'
								)}
								href={item.url ?? '#'}
								target={item.isExternal ? '_blank' : void 0}
							>
								{item.title}
								{item.isExternal && (
									<ArrowUpRight className="-mt-0.5 ml-1 inline-block size-3 text-muted-foreground" />
								)}
							</Link>
						) : (
							<div
								key={item.id}
								className={cn(expandedKeys.has(item.id) ? 'h-auto' : 'h-12')}
							>
								{item.type === 'GROUP' ? (
									<div
										className="flex h-12 w-full cursor-pointer items-center justify-between font-medium"
										onClick={() => handleToggleExpandedKey(item.id)}
									>
										<span className="flex-1 truncate text-start">
											{item.title}
										</span>
										<div className="flex size-12 items-center justify-center">
											<ChevronRight
												className={cn(
													'size-4 transition-transform',
													expandedKeys.has(item.id) && 'rotate-90'
												)}
											/>
										</div>
									</div>
								) : (
									<Link
										className={cn(
											'flex w-full items-center gap-1 font-medium',
											pathname === item.url && 'text-primary'
										)}
										href={item.url ?? '#'}
										target={item.isExternal ? '_blank' : void 0}
									>
										<div className="flex-1 truncate">
											{item.title}
											{item.isExternal && (
												<ArrowUpRight className="-mt-0.5 ml-1 inline-block size-3 text-muted-foreground" />
											)}
										</div>
										<div
											className="flex size-12 cursor-pointer items-center justify-center"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												handleToggleExpandedKey(item.id);
											}}
										>
											<ChevronRight
												className={cn(
													'size-4 transition-transform',
													expandedKeys.has(item.id) && 'rotate-90'
												)}
											/>
										</div>
									</Link>
								)}

								<div
									className={cn(
										expandedKeys.has(item.id) ? 'visible' : 'invisible'
									)}
								>
									{item.children.map((child) => (
										<div key={child.id} className="h-8">
											<Link
												className={cn(
													'block size-full truncate pr-4 pl-2 text-sm leading-8',
													pathname === child.url && 'text-primary'
												)}
												href={child.url ?? '#'}
												target={child.isExternal ? '_blank' : void 0}
											>
												{child.title}
												{child.isExternal && (
													<ArrowUpRight className="-mt-0.5 ml-1 inline-block size-3 text-muted-foreground" />
												)}
											</Link>
										</div>
									))}
								</div>
							</div>
						)
					)}
				</nav>
			</div>
		</div>
	);
};
