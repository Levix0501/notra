'use client';

import { PlaceholderPlugin } from '@platejs/media/react';
import {
	AudioLinesIcon,
	FileUpIcon,
	FilmIcon,
	ImageIcon,
	LinkIcon
} from 'lucide-react';
import { isUrl, KEYS } from 'platejs';
import { useEditorRef } from 'platejs/react';
import * as React from 'react';
import { toast } from 'sonner';
import { useFilePicker } from 'use-file-picker';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { getTranslations } from '@/i18n';

import {
	ToolbarSplitButton,
	ToolbarSplitButtonPrimary,
	ToolbarSplitButtonSecondary
} from './toolbar';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

const t = getTranslations('notra_editor');

const MEDIA_CONFIG: Record<
	string,
	{
		accept: string[];
		icon: React.ReactNode;
		title: string;
		tooltip: string;
	}
> = {
	[KEYS.audio]: {
		accept: ['audio/*'],
		icon: <AudioLinesIcon className="size-4" />,
		title: t.media_toolbar_button_insert_audio,
		tooltip: t.media_toolbar_button_audio
	},
	[KEYS.file]: {
		accept: ['*'],
		icon: <FileUpIcon className="size-4" />,
		title: t.media_toolbar_button_insert_file,
		tooltip: t.media_toolbar_button_file
	},
	[KEYS.img]: {
		accept: ['image/*'],
		icon: <ImageIcon className="size-4" />,
		title: t.media_toolbar_button_insert_image,
		tooltip: t.media_toolbar_button_image
	},
	[KEYS.video]: {
		accept: ['video/*'],
		icon: <FilmIcon className="size-4" />,
		title: t.media_toolbar_button_insert_video,
		tooltip: t.media_toolbar_button_video
	}
};

export function MediaToolbarButton({
	nodeType,
	...props
}: DropdownMenuProps & { nodeType: string }) {
	const currentConfig = MEDIA_CONFIG[nodeType];

	const editor = useEditorRef();
	const [open, setOpen] = React.useState(false);
	const [dialogOpen, setDialogOpen] = React.useState(false);

	const { openFilePicker } = useFilePicker({
		accept: currentConfig.accept,
		multiple: true,
		onFilesSuccessfullySelected: ({ plainFiles }: { plainFiles: unknown }) => {
			editor
				.getTransforms(PlaceholderPlugin)
				.insert.media(plainFiles as FileList);
		}
	});

	return (
		<>
			<ToolbarSplitButton
				pressed={open}
				onClick={() => {
					openFilePicker();
				}}
				onKeyDown={(e) => {
					if (e.key === 'ArrowDown') {
						e.preventDefault();
						setOpen(true);
					}
				}}
			>
				<ToolbarSplitButtonPrimary>
					{currentConfig.icon}
				</ToolbarSplitButtonPrimary>

				<DropdownMenu
					modal={false}
					open={open}
					onOpenChange={setOpen}
					{...props}
				>
					<DropdownMenuTrigger asChild>
						<ToolbarSplitButtonSecondary />
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="start"
						alignOffset={-32}
						onClick={(e) => e.stopPropagation()}
					>
						<DropdownMenuGroup>
							<DropdownMenuItem onSelect={() => openFilePicker()}>
								{currentConfig.icon}
								{t.media_toolbar_button_upload_from_computer}
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setDialogOpen(true)}>
								<LinkIcon />
								{t.media_toolbar_button_insert_via_url}
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</ToolbarSplitButton>

			<AlertDialog
				open={dialogOpen}
				onOpenChange={(value) => {
					setDialogOpen(value);
				}}
			>
				<AlertDialogContent className="gap-6">
					<MediaUrlDialogContent
						currentConfig={currentConfig}
						nodeType={nodeType}
						setOpen={setDialogOpen}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

function MediaUrlDialogContent({
	currentConfig,
	nodeType,
	setOpen
}: Readonly<{
	currentConfig: (typeof MEDIA_CONFIG)[string];
	nodeType: string;
	setOpen: (value: boolean) => void;
}>) {
	const editor = useEditorRef();
	const [url, setUrl] = React.useState('');

	const embedMedia = React.useCallback(() => {
		if (!isUrl(url)) return toast.error(t.media_toolbar_button_invalid_url);

		setOpen(false);
		editor.tf.insertNodes({
			children: [{ text: '' }],
			name: nodeType === KEYS.file ? url.split('/').pop() : undefined,
			type: nodeType,
			url
		});
	}, [url, editor, nodeType, setOpen]);

	return (
		<>
			<AlertDialogHeader>
				<AlertDialogTitle>{currentConfig.title}</AlertDialogTitle>
			</AlertDialogHeader>

			<AlertDialogDescription className="group relative w-full">
				<label
					className="absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
					htmlFor="url"
				>
					<span className="inline-flex bg-background px-2">
						{t.media_toolbar_button_url}
					</span>
				</label>
				<Input
					autoFocus
					className="w-full"
					id="url"
					placeholder=""
					type="url"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') embedMedia();
					}}
				/>
			</AlertDialogDescription>

			<AlertDialogFooter>
				<AlertDialogCancel>{t.media_toolbar_button_cancel}</AlertDialogCancel>
				<AlertDialogAction
					onClick={(e) => {
						e.preventDefault();
						embedMedia();
					}}
				>
					{t.media_toolbar_button_accept}
				</AlertDialogAction>
			</AlertDialogFooter>
		</>
	);
}
