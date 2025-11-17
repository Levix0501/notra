'use client';

import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const t = getTranslations('components_doc_toc');

interface DocTocProps {
	toc: {
		id: string;
		text: string;
		level: number;
	}[];
	onClickItem?: () => void;
	showTitle?: boolean;
}

export const DocToc = ({ toc, onClickItem, showTitle = true }: DocTocProps) => {
	const headings = useRef<HTMLHeadingElement[]>([]);

	const [activeId, setActiveId] = useState<string | null>(null);

	useEffect(() => {
		const article = document.getElementsByTagName('article')[0];

		if (!article) {
			return;
		}

		headings.current = Array.from(article.querySelectorAll('h2, h3'));

		const visibleHeadings = new Set<string>();

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const id = (entry.target as HTMLHeadingElement).dataset?.id as string;

					if (entry.isIntersecting) {
						visibleHeadings.add(id);
					} else {
						visibleHeadings.delete(id);
					}
				});

				const current = toc.find((item) => visibleHeadings.has(item.id));

				if (current) {
					setActiveId(current.id);
				}
			},
			{
				root: null,
				rootMargin: '-80px 0px 0px 0px',
				threshold: 0
			}
		);

		headings.current.forEach((heading) => observer.observe(heading));

		return () => {
			observer.disconnect();
		};
	}, [toc]);

	const handleClick = (id: string) => {
		const heading = headings.current.find(
			(heading) => heading.dataset.id === id
		);

		if (heading) {
			const top = heading.getBoundingClientRect().top + window.scrollY - 80;

			window.scrollTo({
				top,
				behavior: 'smooth'
			});
		}

		if (onClickItem) {
			onClickItem();
		}
	};

	return (
		<nav className="text-sm">
			{showTitle && (
				<div className="mt-2 mb-0.5 font-medium text-muted-foreground">
					{t.on_this_page}
				</div>
			)}
			<ul className="space-y-2.5 py-2 text-muted-foreground">
				{toc.map((item) => (
					<li
						key={item.id}
						className={cn(
							'cursor-pointer hover:text-foreground',
							activeId === item.id && 'font-bold text-primary',
							item.level === 3 && 'pl-3'
						)}
						onClick={() => {
							handleClick(item.id);
						}}
					>
						{item.text}
					</li>
				))}
			</ul>
		</nav>
	);
};

export const DocTocPopover = ({ toc }: DocTocProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost">
					{t.on_this_page}
					<ChevronRight
						className={cn('transition-transform', open && 'rotate-90')}
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="max-h-[50dvh] overflow-y-auto">
				<DocToc
					showTitle={false}
					toc={toc}
					onClickItem={() => setOpen(false)}
				/>
			</PopoverContent>
		</Popover>
	);
};
