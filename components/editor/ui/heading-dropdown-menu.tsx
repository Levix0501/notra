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
import { getTranslations } from '@/i18n';

import { Level } from '../hooks/use-heading';
import { useHeadingDropdownMenu } from '../hooks/use-heading-dropdown-menu';

const t = getTranslations('notra_editor');

const menuItems: { level: Level; label: string }[] = [
	{ level: 1, label: t.slash_command_heading_1 },
	{ level: 2, label: t.slash_command_heading_2 },
	{ level: 3, label: t.slash_command_heading_3 },
	{ level: 4, label: t.slash_command_heading_4 },
	{ level: 5, label: t.slash_command_heading_5 },
	{ level: 6, label: t.slash_command_heading_6 }
];

/**
 * Dropdown menu component for selecting heading levels in a Tiptap editor.
 *
 * For custom dropdown implementations, use the `useHeadingDropdownMenu` hook instead.
 */
export const HeadingDropdownMenu = () => {
	const { editor } = useTiptapEditor();
	const { isVisible, isActive, canToggle, Icon } = useHeadingDropdownMenu({
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
				{menuItems.map(({ level, label }) => (
					<HeadingButton key={`heading-${level}`} level={level} text={label} />
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
