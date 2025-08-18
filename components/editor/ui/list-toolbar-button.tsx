'use client';

import { ListStyleType, someList, toggleList } from '@platejs/list';
import {
	useIndentTodoToolBarButton,
	useIndentTodoToolBarButtonState
} from '@platejs/list/react';
import { List, ListOrdered, ListTodoIcon } from 'lucide-react';
import { useEditorRef, useEditorSelector } from 'platejs/react';
import * as React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';

import {
	ToolbarButton,
	ToolbarSplitButton,
	ToolbarSplitButtonPrimary,
	ToolbarSplitButtonSecondary
} from './toolbar';

const t = getTranslations('notra_editor');

export function BulletedListToolbarButton() {
	const editor = useEditorRef();
	const [open, setOpen] = React.useState(false);

	const pressed = useEditorSelector(
		(editor) =>
			someList(editor, [
				ListStyleType.Disc,
				ListStyleType.Circle,
				ListStyleType.Square
			]),
		[]
	);

	return (
		<ToolbarSplitButton pressed={open}>
			<ToolbarSplitButtonPrimary
				className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
				data-state={pressed ? 'on' : 'off'}
				onClick={() => {
					toggleList(editor, {
						listStyleType: ListStyleType.Disc
					});
				}}
			>
				<List className="size-4" />
			</ToolbarSplitButtonPrimary>

			<DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<ToolbarSplitButtonSecondary />
				</DropdownMenuTrigger>

				<DropdownMenuContent align="start" alignOffset={-32}>
					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() =>
								toggleList(editor, {
									listStyleType: ListStyleType.Disc
								})
							}
						>
							<div className="flex items-center gap-2">
								<div className="size-2 rounded-full border border-current bg-current" />
								{t.list_toolbar_button_default}
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								toggleList(editor, {
									listStyleType: ListStyleType.Circle
								})
							}
						>
							<div className="flex items-center gap-2">
								<div className="size-2 rounded-full border border-current" />
								{t.list_toolbar_button_circle}
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								toggleList(editor, {
									listStyleType: ListStyleType.Square
								})
							}
						>
							<div className="flex items-center gap-2">
								<div className="size-2 border border-current bg-current" />
								{t.list_toolbar_button_square}
							</div>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</ToolbarSplitButton>
	);
}

export function NumberedListToolbarButton() {
	const editor = useEditorRef();
	const [open, setOpen] = React.useState(false);

	const pressed = useEditorSelector(
		(editor) =>
			someList(editor, [
				ListStyleType.Decimal,
				ListStyleType.LowerAlpha,
				ListStyleType.UpperAlpha,
				ListStyleType.LowerRoman,
				ListStyleType.UpperRoman
			]),
		[]
	);

	return (
		<ToolbarSplitButton pressed={open}>
			<ToolbarSplitButtonPrimary
				className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
				data-state={pressed ? 'on' : 'off'}
				onClick={() =>
					toggleList(editor, {
						listStyleType: ListStyleType.Decimal
					})
				}
			>
				<ListOrdered className="size-4" />
			</ToolbarSplitButtonPrimary>

			<DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<ToolbarSplitButtonSecondary />
				</DropdownMenuTrigger>

				<DropdownMenuContent align="start" alignOffset={-32}>
					<DropdownMenuGroup>
						<DropdownMenuItem
							onSelect={() =>
								toggleList(editor, {
									listStyleType: ListStyleType.Decimal
								})
							}
						>
							{t.list_toolbar_button_decimal}
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								toggleList(editor, {
									listStyleType: ListStyleType.LowerAlpha
								})
							}
						>
							{t.list_toolbar_button_lower_alpha}
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								toggleList(editor, {
									listStyleType: ListStyleType.UpperAlpha
								})
							}
						>
							{t.list_toolbar_button_upper_alpha}
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								toggleList(editor, {
									listStyleType: ListStyleType.LowerRoman
								})
							}
						>
							{t.list_toolbar_button_lower_roman}
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								toggleList(editor, {
									listStyleType: ListStyleType.UpperRoman
								})
							}
						>
							{t.list_toolbar_button_upper_roman}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</ToolbarSplitButton>
	);
}

export function TodoListToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const state = useIndentTodoToolBarButtonState({ nodeType: 'todo' });
	const { props: buttonProps } = useIndentTodoToolBarButton(state);

	return (
		<ToolbarButton
			{...props}
			{...buttonProps}
			tooltip={t.list_toolbar_button_todo}
		>
			<ListTodoIcon />
		</ToolbarButton>
	);
}
