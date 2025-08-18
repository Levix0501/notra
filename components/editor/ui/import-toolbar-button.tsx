'use client';

import { MarkdownPlugin } from '@platejs/markdown';
import { ArrowUpToLineIcon } from 'lucide-react';
import { getEditorDOMFromHtmlString } from 'platejs';
import { useEditorRef } from 'platejs/react';
import * as React from 'react';
import { useFilePicker } from 'use-file-picker';

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

type ImportType = 'html' | 'markdown';

const t = getTranslations('notra_editor');

export function ImportToolbarButton(props: Readonly<DropdownMenuProps>) {
	const editor = useEditorRef();
	const [open, setOpen] = React.useState(false);

	const getFileNodes = (text: string, type: ImportType) => {
		if (type === 'html') {
			const editorNode = getEditorDOMFromHtmlString(text);
			const nodes = editor.api.html.deserialize({
				element: editorNode
			});

			return nodes;
		}

		if (type === 'markdown') {
			return editor.getApi(MarkdownPlugin).markdown.deserialize(text);
		}

		return [];
	};

	const { openFilePicker: openMdFilePicker } = useFilePicker({
		accept: ['.md', '.mdx'],
		multiple: false,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onFilesSelected: async ({ plainFiles }: any) => {
			const text = await plainFiles[0].text();

			const nodes = getFileNodes(text, 'markdown');

			editor.tf.insertNodes(nodes);
		}
	});

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					isDropdown
					pressed={open}
					tooltip={t.import_toolbar_button_import}
				>
					<ArrowUpToLineIcon className="size-4" />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start">
				<DropdownMenuGroup>
					<DropdownMenuItem
						onSelect={() => {
							openMdFilePicker();
						}}
					>
						{t.import_toolbar_button_import_from_markdown}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
