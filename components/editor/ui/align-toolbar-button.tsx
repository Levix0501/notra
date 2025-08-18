'use client';

import { TextAlignPlugin } from '@platejs/basic-styles/react';
import {
	AlignCenterIcon,
	AlignJustifyIcon,
	AlignLeftIcon,
	AlignRightIcon
} from 'lucide-react';
import { useEditorPlugin, useSelectionFragmentProp } from 'platejs/react';
import * as React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';

import { ToolbarButton } from './toolbar';

import type { Alignment } from '@platejs/basic-styles';
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

const items = [
	{
		icon: AlignLeftIcon,
		value: 'left'
	},
	{
		icon: AlignCenterIcon,
		value: 'center'
	},
	{
		icon: AlignRightIcon,
		value: 'right'
	},
	{
		icon: AlignJustifyIcon,
		value: 'justify'
	}
];

export function AlignToolbarButton(props: Readonly<DropdownMenuProps>) {
	const { editor, tf } = useEditorPlugin(TextAlignPlugin);
	const value =
		useSelectionFragmentProp({
			defaultValue: 'start',
			getProp: (node) => node.align
		}) ?? 'left';

	const [open, setOpen] = React.useState(false);
	const IconValue =
		items.find((item) => item.value === value)?.icon ?? AlignLeftIcon;

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					isDropdown
					pressed={open}
					tooltip={getTranslations('notra_editor').align_toolbar_button_align}
				>
					<IconValue />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start" className="min-w-0">
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={(value) => {
						tf.textAlign.setNodes(value as Alignment);
						editor.tf.focus();
					}}
				>
					{items.map(({ icon: Icon, value: itemValue }) => (
						<DropdownMenuRadioItem
							key={itemValue}
							className="pl-2 data-[state=checked]:bg-accent *:first:[span]:hidden"
							value={itemValue}
						>
							<Icon />
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
