'use client';

import {
	FloatingMedia as FloatingMediaPrimitive,
	FloatingMediaStore,
	useFloatingMediaValue,
	useImagePreviewValue
} from '@platejs/media/react';
import { cva } from 'class-variance-authority';
import { Link, Trash2Icon } from 'lucide-react';
import {
	useEditorRef,
	useEditorSelector,
	useElement,
	useReadOnly,
	useRemoveNodeButton,
	useSelected
} from 'platejs/react';
import * as React from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
	Popover,
	PopoverAnchor,
	PopoverContent
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { getTranslations } from '@/i18n';

import { CaptionButton } from './caption';

import type { WithRequiredKey } from 'platejs';

const inputVariants = cva(
	'flex h-[28px] w-full rounded-md border-none bg-transparent px-1.5 py-1 text-base placeholder:text-muted-foreground focus-visible:ring-transparent focus-visible:outline-none md:text-sm'
);

const t = getTranslations('notra_editor');

export function MediaToolbar({
	children,
	plugin
}: Readonly<{
	children: React.ReactNode;
	plugin: WithRequiredKey;
}>) {
	const editor = useEditorRef();
	const readOnly = useReadOnly();
	const selected = useSelected();

	const selectionCollapsed = useEditorSelector(
		(editor) => !editor.api.isExpanded(),
		[]
	);
	const isImagePreviewOpen = useImagePreviewValue('isOpen', editor.id);
	const isOpen =
		!readOnly && selected && selectionCollapsed && !isImagePreviewOpen;
	const isEditing = useFloatingMediaValue('isEditing');

	React.useEffect(() => {
		if (!isOpen && isEditing) {
			FloatingMediaStore.set('isEditing', false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	const element = useElement();
	const { props: buttonProps } = useRemoveNodeButton({ element });

	if (readOnly) return <>{children}</>;

	return (
		<Popover modal={false} open={isOpen}>
			<PopoverAnchor>{children}</PopoverAnchor>

			<PopoverContent
				className="w-auto p-1"
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				{isEditing ? (
					<div className="flex w-[330px] flex-col">
						<div className="flex items-center">
							<div className="flex items-center pr-1 pl-2 text-muted-foreground">
								<Link className="size-4" />
							</div>

							<FloatingMediaPrimitive.UrlInput
								className={inputVariants()}
								options={{ plugin }}
								placeholder={t.media_toolbar_paste_embed_link}
							/>
						</div>
					</div>
				) : (
					<div className="box-content flex items-center">
						<FloatingMediaPrimitive.EditButton
							className={buttonVariants({ size: 'sm', variant: 'ghost' })}
						>
							{t.media_toolbar_edit_link}
						</FloatingMediaPrimitive.EditButton>

						<CaptionButton size="sm" variant="ghost">
							{t.media_toolbar_caption}
						</CaptionButton>

						<Separator className="mx-1 h-6" orientation="vertical" />

						<Button size="sm" variant="ghost" {...buttonProps}>
							<Trash2Icon />
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
