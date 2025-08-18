'use client';

import { LineHeightPlugin } from '@platejs/basic-styles/react';
import { DropdownMenuItemIndicator } from '@radix-ui/react-dropdown-menu';
import { CheckIcon, WrapText } from 'lucide-react';
import { useEditorRef, useSelectionFragmentProp } from 'platejs/react';
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

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

export function LineHeightToolbarButton(props: Readonly<DropdownMenuProps>) {
	const editor = useEditorRef();
	const { defaultNodeValue, validNodeValues: values = [] } =
		editor.getInjectProps(LineHeightPlugin);

	const value = useSelectionFragmentProp({
		defaultValue: defaultNodeValue,
		getProp: (node) => node.lineHeight
	});

	const [open, setOpen] = React.useState(false);

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					isDropdown
					pressed={open}
					tooltip={
						getTranslations('notra_editor')
							.line_height_toolbar_button_line_height
					}
				>
					<WrapText />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start" className="min-w-0">
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={(newValue) => {
						editor
							.getTransforms(LineHeightPlugin)
							.lineHeight.setNodes(Number(newValue));
						editor.tf.focus();
					}}
				>
					{values.map((value) => (
						<DropdownMenuRadioItem
							key={value}
							className="min-w-[180px] pl-2 *:first:[span]:hidden"
							value={value}
						>
							<span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
								<DropdownMenuItemIndicator>
									<CheckIcon />
								</DropdownMenuItemIndicator>
							</span>
							{value}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
