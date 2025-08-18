'use client';

import { DropdownMenuItemIndicator } from '@radix-ui/react-dropdown-menu';
import {
	CheckIcon,
	ChevronRightIcon,
	Columns3Icon,
	FileCodeIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	Heading4Icon,
	Heading5Icon,
	Heading6Icon,
	ListIcon,
	ListOrderedIcon,
	PilcrowIcon,
	QuoteIcon,
	SquareIcon
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorRef, useSelectionFragmentProp } from 'platejs/react';
import * as React from 'react';

import { getBlockType, setBlockType } from '@/components/editor/transforms';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';

import { ToolbarButton, ToolbarMenuGroup } from './toolbar';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import type { TElement } from 'platejs';

const t = getTranslations('notra_editor');

const turnIntoItems = [
	{
		icon: <PilcrowIcon />,
		keywords: ['paragraph'],
		label: t.turn_into_toolbar_button_text,
		value: KEYS.p
	},
	{
		icon: <Heading1Icon />,
		keywords: ['title', 'h1'],
		label: t.turn_into_toolbar_button_heading_1,
		value: 'h1'
	},
	{
		icon: <Heading2Icon />,
		keywords: ['subtitle', 'h2'],
		label: t.turn_into_toolbar_button_heading_2,
		value: 'h2'
	},
	{
		icon: <Heading3Icon />,
		keywords: ['subtitle', 'h3'],
		label: t.turn_into_toolbar_button_heading_3,
		value: 'h3'
	},
	{
		icon: <Heading4Icon />,
		keywords: ['subtitle', 'h4'],
		label: t.turn_into_toolbar_button_heading_4,
		value: 'h4'
	},
	{
		icon: <Heading5Icon />,
		keywords: ['subtitle', 'h5'],
		label: t.turn_into_toolbar_button_heading_5,
		value: 'h5'
	},
	{
		icon: <Heading6Icon />,
		keywords: ['subtitle', 'h6'],
		label: t.turn_into_toolbar_button_heading_6,
		value: 'h6'
	},
	{
		icon: <ListIcon />,
		keywords: ['unordered', 'ul', '-'],
		label: t.turn_into_toolbar_button_bulleted_list,
		value: KEYS.ul
	},
	{
		icon: <ListOrderedIcon />,
		keywords: ['ordered', 'ol', '1'],
		label: t.turn_into_toolbar_button_numbered_list,
		value: KEYS.ol
	},
	{
		icon: <SquareIcon />,
		keywords: ['checklist', 'task', 'checkbox', '[]'],
		label: t.turn_into_toolbar_button_todo_list,
		value: KEYS.listTodo
	},
	{
		icon: <ChevronRightIcon />,
		keywords: ['collapsible', 'expandable'],
		label: t.turn_into_toolbar_button_toggle_list,
		value: KEYS.toggle
	},
	{
		icon: <FileCodeIcon />,
		keywords: ['```'],
		label: t.turn_into_toolbar_button_code_block,
		value: KEYS.codeBlock
	},
	{
		icon: <QuoteIcon />,
		keywords: ['citation', 'blockquote', '>'],
		label: t.turn_into_toolbar_button_quote,
		value: KEYS.blockquote
	},
	{
		icon: <Columns3Icon />,
		label: t.turn_into_toolbar_button_3_columns,
		value: 'action_three_columns'
	}
];

export function TurnIntoToolbarButton(props: Readonly<DropdownMenuProps>) {
	const editor = useEditorRef();
	const [open, setOpen] = React.useState(false);

	const value = useSelectionFragmentProp({
		defaultValue: KEYS.p,
		getProp: (node) => getBlockType(node as TElement)
	});
	const selectedItem = React.useMemo(
		() =>
			turnIntoItems.find((item) => item.value === (value ?? KEYS.p)) ??
			turnIntoItems[0],
		[value]
	);

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					isDropdown
					className="min-w-[125px]"
					pressed={open}
					tooltip={t.turn_into_toolbar_button_turn_into}
				>
					{selectedItem.label}
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				className="ignore-click-outside/toolbar min-w-0"
				onCloseAutoFocus={(e) => {
					e.preventDefault();
					editor.tf.focus();
				}}
			>
				<ToolbarMenuGroup
					label={t.turn_into_toolbar_button_turn_into}
					value={value}
					onValueChange={(type) => {
						setBlockType(editor, type);
					}}
				>
					{turnIntoItems.map(({ icon, label, value: itemValue }) => (
						<DropdownMenuRadioItem
							key={itemValue}
							className="min-w-[180px] pl-2 *:first:[span]:hidden"
							value={itemValue}
						>
							<span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
								<DropdownMenuItemIndicator>
									<CheckIcon />
								</DropdownMenuItemIndicator>
							</span>
							{icon}
							{label}
						</DropdownMenuRadioItem>
					))}
				</ToolbarMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
