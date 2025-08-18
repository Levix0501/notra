'use client';

import {
	KeyboardIcon,
	MoreHorizontalIcon,
	SubscriptIcon,
	SuperscriptIcon
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorRef } from 'platejs/react';
import * as React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';

import { ToolbarButton } from './toolbar';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

const t = getTranslations('notra_editor');

export function MoreToolbarButton(props: Readonly<DropdownMenuProps>) {
	const editor = useEditorRef();
	const [open, setOpen] = React.useState(false);

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton pressed={open} tooltip={t.more_toolbar_button_insert}>
					<MoreHorizontalIcon />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				className="ignore-click-outside/toolbar flex max-h-[500px] min-w-[180px] flex-col overflow-y-auto"
			>
				<DropdownMenuGroup>
					<DropdownMenuItem
						onSelect={() => {
							editor.tf.toggleMark(KEYS.kbd);
							editor.tf.collapse({ edge: 'end' });
							editor.tf.focus();
						}}
					>
						<KeyboardIcon />
						{t.more_toolbar_button_keyboard_input}
					</DropdownMenuItem>

					<DropdownMenuItem
						onSelect={() => {
							editor.tf.toggleMark(KEYS.sup, {
								remove: KEYS.sub
							});
							editor.tf.focus();
						}}
					>
						<SuperscriptIcon />
						{t.more_toolbar_button_superscript}
						{/* (⌘+,) */}
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={() => {
							editor.tf.toggleMark(KEYS.sub, {
								remove: KEYS.sup
							});
							editor.tf.focus();
						}}
					>
						<SubscriptIcon />
						{t.more_toolbar_button_subscript}
						{/* (⌘+.) */}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
