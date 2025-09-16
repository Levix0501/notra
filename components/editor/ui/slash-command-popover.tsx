import { Editor } from '@tiptap/react';
import { SuggestionKeyDownProps } from '@tiptap/suggestion';
import {
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	LucideIcon,
	Heading6,
	List,
	ListOrdered,
	ListTodo,
	TextQuote
} from 'lucide-react';
import { useImperativeHandle, useState } from 'react';
import { RemoveScroll } from 'react-remove-scroll';

import { Popover, PopoverContent } from '@/components/ui/popover';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

interface GroupItem {
	icon: LucideIcon;
	label: string;
	enLabel: string;
	keywords?: string[];
	action: (editor: Editor) => void;
}

interface Group {
	label: string;
	items: GroupItem[];
}

const t = getTranslations('notra_editor');

export const groups: Group[] = [
	{
		label: t.slash_command_basic_block,
		items: [
			{
				icon: Heading1,
				label: t.heading_1,
				enLabel: 'Heading 1',
				keywords: ['title', 'h1'],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 1 }).run();
				}
			},
			{
				icon: Heading2,
				label: t.heading_2,
				enLabel: 'Heading 2',
				keywords: ['subtitle', 'h2'],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 2 }).run();
				}
			},
			{
				icon: Heading3,
				label: t.heading_3,
				enLabel: 'Heading 3',
				keywords: ['subtitle', 'h3'],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 3 }).run();
				}
			},
			{
				icon: Heading4,
				label: t.heading_4,
				enLabel: 'Heading 4',
				keywords: ['subtitle', 'h4'],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 4 }).run();
				}
			},
			{
				icon: Heading5,
				label: t.heading_5,
				enLabel: 'Heading 5',
				keywords: ['subtitle', 'h5'],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 5 }).run();
				}
			},
			{
				icon: Heading6,
				label: t.heading_6,
				enLabel: 'Heading 6',
				keywords: ['subtitle', 'h6'],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 6 }).run();
				}
			},
			{
				icon: List,
				label: t.bulleted_list,
				keywords: ['unordered', 'ul', '-'],
				enLabel: 'Bulleted List',
				action: (editor) => {
					editor.chain().focus().toggleBulletList().run();
				}
			},
			{
				icon: ListOrdered,
				label: t.numbered_list,
				keywords: ['ordered', 'ol', '1'],
				enLabel: 'Numbered List',
				action: (editor) => {
					editor.chain().focus().toggleOrderedList().run();
				}
			},
			{
				icon: ListTodo,
				label: t.todo_list,
				keywords: ['checklist', 'task', 'checkbox', '[]'],
				enLabel: 'To-do List',
				action: (editor) => {
					editor.chain().focus().toggleTaskList().run();
				}
			},
			{
				icon: TextQuote,
				label: t.blockquote,
				keywords: ['citation', 'blockquote', 'quote', '>'],
				enLabel: 'Blockquote',
				action: (editor) => {
					editor.chain().focus().toggleBlockquote().run();
				}
			}
		]
	}
];

export const POPOVER_MIN_HEIGHT = 200;
export const POPOVER_MAX_HEIGHT = 400;
export const POPOVER_WIDTH = 256;
export const POPOVER_GAP = 8;

export type SlashCommandPopoverHandle = {
	onKeyDown: (props: SuggestionKeyDownProps) => void;
};

export interface SlashCommandPopoverProps {
	ref: React.RefObject<SlashCommandPopoverHandle | null>;
	isOpen: boolean;
	popoverRect: DOMRect;
	items: Group[];
	command: (groupItem: GroupItem) => void;
}

export const SlashCommandPopover = ({
	ref,
	isOpen,
	popoverRect,
	items,
	command
}: Readonly<SlashCommandPopoverProps>) => {
	const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
	const [selectedItemIndex, setSelectedItemIndex] = useState(0);

	const handleKeyDown = (props: SuggestionKeyDownProps) => {
		const { event } = props;

		if (event.key === 'ArrowDown') {
			let newItemIndex = selectedItemIndex + 1;
			let newGroupIndex = selectedGroupIndex;

			if (newItemIndex >= groups[selectedGroupIndex].items.length) {
				newItemIndex = 0;
				newGroupIndex = selectedGroupIndex + 1;

				if (newGroupIndex >= groups.length) {
					newGroupIndex = 0;
				}
			}

			setSelectedGroupIndex(newGroupIndex);
			setSelectedItemIndex(newItemIndex);

			return true;
		}

		if (event.key === 'ArrowUp') {
			let newItemIndex = selectedItemIndex - 1;
			let newGroupIndex = selectedGroupIndex;

			if (newItemIndex < 0) {
				newGroupIndex = selectedGroupIndex - 1;

				if (newGroupIndex < 0) {
					newGroupIndex = groups.length - 1;
				}

				newItemIndex = groups[newGroupIndex].items.length - 1;
			}

			setSelectedGroupIndex(newGroupIndex);
			setSelectedItemIndex(newItemIndex);

			return true;
		}

		if (event.key === 'Enter') {
			if (items.length === 0) {
				return false;
			}

			command(items[selectedGroupIndex].items[selectedItemIndex]);

			return true;
		}

		return false;
	};

	useImperativeHandle(ref, () => ({
		onKeyDown: handleKeyDown
	}));

	return (
		<RemoveScroll>
			<Popover open={isOpen}>
				<PopoverContent
					className={cn(
						'absolute p-0',
						items.length > 0 ? 'opacity-100' : 'opacity-0'
					)}
					style={{
						left: popoverRect.x,
						top: popoverRect.y,
						width: popoverRect.width
					}}
				>
					<div
						className="overflow-y-auto p-1"
						style={{ maxHeight: popoverRect.height }}
					>
						{items.map((group, groupIndex) => (
							<div key={group.label}>
								<div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
									{group.label}
								</div>
								{group.items.map((item, itemIndex) => (
									<div
										key={item.label}
										className={cn(
											'flex h-8 cursor-pointer items-center gap-2 rounded-sm px-2 text-sm text-foreground',
											selectedGroupIndex === groupIndex &&
												selectedItemIndex === itemIndex &&
												'bg-accent'
										)}
										onClick={() => {
											command(item);
										}}
										onMouseEnter={() => {
											setSelectedGroupIndex(groupIndex);
											setSelectedItemIndex(itemIndex);
										}}
									>
										<item.icon className="size-5" strokeWidth={1.5} />
										<span>{item.label}</span>
									</div>
								))}
							</div>
						))}
					</div>
				</PopoverContent>
			</Popover>
		</RemoveScroll>
	);
};
