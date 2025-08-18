'use client';

import {
	CalendarIcon,
	ChevronRightIcon,
	Code2,
	Columns3Icon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	Heading4Icon,
	Heading5Icon,
	Heading6Icon,
	LightbulbIcon,
	ListIcon,
	ListOrdered,
	PilcrowIcon,
	Quote,
	RadicalIcon,
	Square,
	Table,
	TableOfContentsIcon
} from 'lucide-react';
import { type TComboboxInputElement, KEYS } from 'platejs';
import { PlateElement } from 'platejs/react';
import * as React from 'react';

import {
	insertBlock,
	insertInlineElement
} from '@/components/editor/transforms';
import { getTranslations } from '@/i18n';

import {
	InlineCombobox,
	InlineComboboxContent,
	InlineComboboxEmpty,
	InlineComboboxGroup,
	InlineComboboxGroupLabel,
	InlineComboboxInput,
	InlineComboboxItem
} from './inline-combobox';

import type { PlateEditor, PlateElementProps } from 'platejs/react';

type Group = {
	group: string;
	items: Item[];
};

interface Item {
	icon: React.ReactNode;
	value: string;
	onSelect: (editor: PlateEditor, value: string) => void;
	className?: string;
	focusEditor?: boolean;
	keywords?: string[];
	label?: string;
}

const t = getTranslations('notra_editor');

const groups: Group[] = [
	// {
	//   group: 'AI',
	//   items: [
	//     {
	//       focusEditor: false,
	//       icon: <SparklesIcon />,
	//       value: 'AI',
	//       onSelect: (editor) => {
	//         editor.getApi(AIChatPlugin).aiChat.show();
	//       },
	//     },
	//   ],
	// },
	{
		group: t.slash_node_basic_blocks,
		items: [
			{
				icon: <PilcrowIcon />,
				keywords: ['paragraph'],
				label: t.slash_node_text,
				value: KEYS.p
			},
			{
				icon: <Heading1Icon />,
				keywords: ['title', 'h1'],
				label: t.slash_node_heading_1,
				value: KEYS.h1
			},
			{
				icon: <Heading2Icon />,
				keywords: ['subtitle', 'h2'],
				label: t.slash_node_heading_2,
				value: KEYS.h2
			},
			{
				icon: <Heading3Icon />,
				keywords: ['subtitle', 'h3'],
				label: t.slash_node_heading_3,
				value: KEYS.h3
			},
			{
				icon: <Heading4Icon />,
				keywords: ['subtitle', 'h4'],
				label: t.slash_node_heading_4,
				value: KEYS.h4
			},
			{
				icon: <Heading5Icon />,
				keywords: ['subtitle', 'h5'],
				label: t.slash_node_heading_5,
				value: KEYS.h5
			},
			{
				icon: <Heading6Icon />,
				keywords: ['subtitle', 'h6'],
				label: t.slash_node_heading_6,
				value: KEYS.h6
			},
			{
				icon: <ListIcon />,
				keywords: ['unordered', 'ul', '-'],
				label: t.slash_node_bulleted_list,
				value: KEYS.ul
			},
			{
				icon: <ListOrdered />,
				keywords: ['ordered', 'ol', '1'],
				label: t.slash_node_numbered_list,
				value: KEYS.ol
			},
			{
				icon: <Square />,
				keywords: ['checklist', 'task', 'checkbox', '[]'],
				label: t.slash_node_todo_list,
				value: KEYS.listTodo
			},
			{
				icon: <ChevronRightIcon />,
				keywords: ['collapsible', 'expandable'],
				label: t.slash_node_toggle_list,
				value: KEYS.toggle
			},
			{
				icon: <Code2 />,
				keywords: ['```'],
				label: t.slash_node_code_block,
				value: KEYS.codeBlock
			},
			{
				icon: <Table />,
				label: t.slash_node_table,
				value: KEYS.table
			},
			{
				icon: <Quote />,
				keywords: ['citation', 'blockquote', 'quote', '>'],
				label: t.slash_node_blockquote,
				value: KEYS.blockquote
			},
			{
				description: 'Insert a highlighted block.',
				icon: <LightbulbIcon />,
				keywords: ['note'],
				label: t.slash_node_callout,
				value: KEYS.callout
			}
		].map((item) => ({
			...item,
			onSelect: (editor, value) => {
				insertBlock(editor, value);
			}
		}))
	},
	{
		group: t.slash_node_advanced_blocks,
		items: [
			{
				icon: <TableOfContentsIcon />,
				keywords: ['toc'],
				label: t.slash_node_table_of_contents,
				value: KEYS.toc
			},
			{
				icon: <Columns3Icon />,
				label: t.slash_node_3_columns,
				value: 'action_three_columns'
			},
			{
				focusEditor: false,
				icon: <RadicalIcon />,
				label: t.slash_node_equation,
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
		group: t.slash_node_inline,
		items: [
			{
				focusEditor: true,
				icon: <CalendarIcon />,
				keywords: ['time'],
				label: t.slash_node_date,
				value: KEYS.date
			},
			{
				focusEditor: false,
				icon: <RadicalIcon />,
				label: t.slash_node_inline_equation,
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

export function SlashInputElement(
	props: PlateElementProps<TComboboxInputElement>
) {
	const { editor, element } = props;

	return (
		<PlateElement {...props} as="span" data-slate-value={element.value}>
			<InlineCombobox element={element} trigger="/">
				<InlineComboboxInput />

				<InlineComboboxContent>
					<InlineComboboxEmpty>{t.slash_node_no_results}</InlineComboboxEmpty>

					{groups.map(({ group, items }) => (
						<InlineComboboxGroup key={group}>
							<InlineComboboxGroupLabel>{group}</InlineComboboxGroupLabel>

							{items.map(
								({ focusEditor, icon, keywords, label, value, onSelect }) => (
									<InlineComboboxItem
										key={value}
										focusEditor={focusEditor}
										group={group}
										keywords={keywords}
										label={label}
										value={value}
										onClick={() => onSelect(editor, value)}
									>
										<div className="mr-2 text-muted-foreground">{icon}</div>
										{label ?? value}
									</InlineComboboxItem>
								)
							)}
						</InlineComboboxGroup>
					))}
				</InlineComboboxContent>
			</InlineCombobox>

			{props.children}
		</PlateElement>
	);
}
