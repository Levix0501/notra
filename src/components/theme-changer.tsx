'use client';

import { Monitor, MoonStar, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';

export function ThemeChanger() {
	const [displayedTheme, setDisplayedTheme] = useState<string | undefined>(
		undefined
	);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setDisplayedTheme(theme);
	}, [theme]);

	return (
		<div className="flex rounded-full border border-border p-0.75">
			<Button
				aria-label={`Switch to light theme`}
				className={cn(
					'size-8 rounded-full text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent dark:hover:text-foreground',
					displayedTheme === 'light' &&
						'bg-accent text-foreground hover:bg-accent dark:hover:bg-accent'
				)}
				size="icon"
				variant="ghost"
				onClick={() => setTheme('light')}
			>
				<Sun />
			</Button>
			<Button
				aria-label={`Switch to system theme`}
				className={cn(
					'size-8 rounded-full text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent dark:hover:text-foreground',
					displayedTheme === 'system' &&
						'bg-accent text-foreground hover:bg-accent dark:hover:bg-accent'
				)}
				size="icon"
				variant="ghost"
				onClick={() => setTheme('system')}
			>
				<Monitor />
			</Button>
			<Button
				aria-label={`Switch to dark theme`}
				className={cn(
					'size-8 rounded-full text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent dark:hover:text-foreground',
					displayedTheme === 'dark' &&
						'bg-accent text-foreground hover:bg-accent dark:hover:bg-accent'
				)}
				size="icon"
				variant="ghost"
				onClick={() => setTheme('dark')}
			>
				<MoonStar />
			</Button>
		</div>
	);
}
