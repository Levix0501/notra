'use client';

import {
	CalendarIcon,
	ChevronRightIcon,
	Columns3Icon,
	FileCodeIcon,
	FilmIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	Heading4Icon,
	Heading5Icon,
	Heading6Icon,
	ImageIcon,
	Link2Icon,
	ListIcon,
	ListOrderedIcon,
	MinusIcon,
	PilcrowIcon,
	PlusIcon,
	QuoteIcon,
	RadicalIcon,
	SquareIcon,
	TableIcon,
	TableOfContentsIcon
} from 'lucide-react';
import { KEYS } from 'platejs';
import { type PlateEditor, useEditorRef } from 'platejs/react';
import * as React from 'react';

import {
	insertBlock,
	insertInlineElement
} from '@/components/editor/transforms';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';

import { ToolbarButton, ToolbarMenuGroup } from './toolbar';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

type Group = {
	group: string;
	items: Item[];
};

interface Item {
	icon: React.ReactNode;
	value: string;
	onSelect: (editor: PlateEditor, value: string) => void;
	focusEditor?: boolean;
	label?: string;
}

const t = getTranslations('notra_editor');

const groups: Group[] = [
	{
		group: t.insert_toolbar_button_basic_blocks,
		items: [
			{
				icon: <PilcrowIcon />,
				label: t.insert_toolbar_button_paragraph,
				value: KEYS.p
			},
			{
				icon: <Heading1Icon />,
				label: t.insert_toolbar_button_heading_1,
				value: 'h1'
			},
			{
				icon: <Heading2Icon />,
				label: t.insert_toolbar_button_heading_2,
				value: 'h2'
			},
			{
				icon: <Heading3Icon />,
				label: t.insert_toolbar_button_heading_3,
				value: 'h3'
			},
			{
				icon: <Heading4Icon />,
				label: t.insert_toolbar_button_heading_4,
				value: 'h4'
			},
			{
				icon: <Heading5Icon />,
				label: t.insert_toolbar_button_heading_5,
				value: 'h5'
			},
			{
				icon: <Heading6Icon />,
				label: t.insert_toolbar_button_heading_6,
				value: 'h6'
			},

			{
				icon: <TableIcon />,
				label: t.insert_toolbar_button_table,
				value: KEYS.table
			},
			{
				icon: <FileCodeIcon />,
				label: t.insert_toolbar_button_code,
				value: KEYS.codeBlock
			},
			{
				icon: <QuoteIcon />,
				label: t.insert_toolbar_button_quote,
				value: KEYS.blockquote
			},
			{
				icon: <MinusIcon />,
				label: t.insert_toolbar_button_divider,
				value: KEYS.hr
			}
		].map((item) => ({
			...item,
			onSelect: (editor, value) => {
				insertBlock(editor, value);
			}
		}))
	},
	{
		group: t.insert_toolbar_button_lists,
		items: [
			{
				icon: <ListIcon />,
				label: t.insert_toolbar_button_bulleted_list,
				value: KEYS.ul
			},
			{
				icon: <ListOrderedIcon />,
				label: t.insert_toolbar_button_numbered_list,
				value: KEYS.ol
			},
			{
				icon: <SquareIcon />,
				label: t.insert_toolbar_button_todo_list,
				value: KEYS.listTodo
			},
			{
				icon: <ChevronRightIcon />,
				label: t.insert_toolbar_button_toggle_list,
				value: KEYS.toggle
			}
		].map((item) => ({
			...item,
			onSelect: (editor, value) => {
				insertBlock(editor, value);
			}
		}))
	},
	{
		group: t.insert_toolbar_button_media,
		items: [
			{
				icon: <ImageIcon />,
				label: t.insert_toolbar_button_image,
				value: KEYS.img
			},
			{
				icon: <FilmIcon />,
				label: t.insert_toolbar_button_embed,
				value: KEYS.mediaEmbed
			}
		].map((item) => ({
			...item,
			onSelect: (editor, value) => {
				insertBlock(editor, value);
			}
		}))
	},
	{
		group: t.insert_toolbar_button_advanced_blocks,
		items: [
			{
				icon: <TableOfContentsIcon />,
				label: t.insert_toolbar_button_table_of_contents,
				value: KEYS.toc
			},
			{
				icon: <Columns3Icon />,
				label: t.insert_toolbar_button_3_columns,
				value: 'action_three_columns'
			},
			{
				focusEditor: false,
				icon: <RadicalIcon />,
				label: t.insert_toolbar_button_equation,
				value: KEYS.equation
			}
		].map((item) => ({
			...item,
			onSelect: (editor, value) => {
				insertBlock(editor, value);
			}
		}))
	},
	{
		group: t.insert_toolbar_button_inline,
		items: [
			{
				icon: <Link2Icon />,
				label: t.insert_toolbar_button_link,
				value: KEYS.link
			},
			{
				focusEditor: true,
				icon: <CalendarIcon />,
				label: t.insert_toolbar_button_date,
				value: KEYS.date
			},
			{
				focusEditor: false,
				icon: <RadicalIcon />,
				label: t.insert_toolbar_button_inline_equation,
				value: KEYS.inlineEquation
			}
		].map((item) => ({
			...item,
			onSelect: (editor, value) => {
				insertInlineElement(editor, value);
			}
		}))
	}
];

export function InsertToolbarButton(props: Readonly<DropdownMenuProps>) {
	const editor = useEditorRef();
	const [open, setOpen] = React.useState(false);

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					isDropdown
					pressed={open}
					tooltip={t.insert_toolbar_button_insert}
				>
					<PlusIcon />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				className="flex max-h-[500px] min-w-0 flex-col overflow-y-auto"
			>
				{groups.map(({ group, items: nestedItems }) => (
					<ToolbarMenuGroup key={group} label={group}>
						{nestedItems.map(({ icon, label, value, onSelect }) => (
							<DropdownMenuItem
								key={value}
								className="min-w-[180px]"
								onSelect={() => {
									onSelect(editor, value);
									editor.tf.focus();
								}}
							>
								{icon}
								{label}
							</DropdownMenuItem>
						))}
					</ToolbarMenuGroup>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
