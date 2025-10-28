import { ArrowUpRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { TreeNodeService } from '@/services/tree-node';

import { Button } from './ui/button';

export const NavbarStatic = async () => {
	const { data: navItems } = await TreeNodeService.getPublishedNavItems();

	return (
		<nav className="hidden h-full items-center md:flex">
			{navItems?.map((item) =>
				item.children.length === 0 ? (
					<Link
						key={item.id}
						className="px-3 text-sm leading-14 transition-colors duration-250 hover:text-primary"
						href={item.url ?? '#'}
						target={item.isExternal ? '_blank' : void 0}
					>
						{item.title}
					</Link>
				) : (
					<div key={item.id} className="group relative h-full">
						{item.type === 'GROUP' ? (
							<Button
								className="h-full cursor-default gap-1 px-3 leading-14 transition-colors duration-250 group-hover:text-muted-foreground hover:bg-transparent hover:text-muted-foreground dark:hover:bg-transparent"
								variant="ghost"
							>
								{item.title}
								<ChevronDown className="size-4" />
							</Button>
						) : (
							<Link
								className="flex h-full items-center gap-1 px-3 text-sm leading-14 transition-colors duration-250 hover:text-primary"
								href={item.url ?? '#'}
								target={item.isExternal ? '_blank' : void 0}
							>
								{item.title}
								<ChevronDown className="size-4" />
							</Link>
						)}
						<div className="invisible absolute top-[43px] left-0 max-h-[calc(100dvh-3.5rem)] w-48 -translate-y-1 bg-background opacity-0 transition-all duration-250 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
							<div className="rounded-md border border-transparent py-3 shadow-[0_12px_32px_rgba(0,0,0,.1),0_2px_6px_rgba(0,0,0,.08)] dark:border-border dark:shadow-[0_1px_2px_rgba(0,0,0,.04),0_1px_2px_rgba(0,0,0,.06)]">
								{item.children.map((child) => (
									<Link
										key={child.id}
										className="block w-full px-4.5 py-0.5 text-sm leading-6 transition-colors duration-250 hover:text-primary"
										href={child.url ?? '#'}
										target={child.isExternal ? '_blank' : void 0}
									>
										{child.title}
										{child.isExternal && (
											<ArrowUpRight className="-mt-0.5 ml-1 inline-block size-3 text-muted-foreground" />
										)}
									</Link>
								))}
							</div>
						</div>
					</div>
				)
			)}
		</nav>
	);
};
