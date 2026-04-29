'use client';

import { ChevronDown } from 'lucide-react';

import { useTiptapEditor } from '@/components/editor/hooks/use-tiptap-editor';
import { HeadingButton } from '@/components/editor/ui/heading-button';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { useHeadingDropdownMenu } from '../hooks/use-heading-dropdown-menu';

export const HeadingDropdownMenu = () => {
	const { editor } = useTiptapEditor();
	const { isVisible, isActive, canToggle, Icon, levels } =
		useHeadingDropdownMenu({
			editor,
			levels: [1, 2, 3, 4, 5, 6]
		});

	if (!isVisible) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label="Format text as heading"
					aria-pressed={isActive}
					data-active-state={isActive ? 'on' : 'off'}
					data-disabled={!canToggle}
					data-style="ghost"
					disabled={!canToggle}
					isActive={isActive}
					size="xs"
					tabIndex={-1}
					variant="ghost"
				>
					<Icon />
					<ChevronDown className="size-2.5" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				onCloseAutoFocus={(e) => e.preventDefault()}
			>
				{levels.map((level) => (
					<HeadingButton key={`heading-${level}`} level={level} />
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
