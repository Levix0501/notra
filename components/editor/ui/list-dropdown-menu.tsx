'use client';

import { ChevronDown } from 'lucide-react';

import { useTiptapEditor } from '@/components/editor/hooks/use-tiptap-editor';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { ListButton } from './list-button';
import { useListDropdownMenu } from '../hooks/use-list-dropdown-menu';

export const ListDropdownMenu = () => {
	const { editor } = useTiptapEditor();
	const { filteredLists, canToggle, isActive, isVisible, Icon } =
		useListDropdownMenu({
			editor,
			types: ['bulletList', 'orderedList', 'taskList']
		});

	if (!isVisible || !editor || !editor.isEditable) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label="List options"
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
				{filteredLists.map(({ type }) => (
					<ListButton key={type} type={type} />
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
