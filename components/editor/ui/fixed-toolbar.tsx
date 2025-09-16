'use client';

import { useNotraSidebar } from '@/components/notra-sidebar';
import { Separator } from '@/components/ui/separator';
import { Spacer } from '@/components/ui/spacer';
import { cn } from '@/lib/utils';
import { ChildrenProps } from '@/types/common';

import { BlockquoteButton } from './blockquote-button';
import { CodeBlockButton } from './code-block-button';
import { HeadingDropdownMenu } from './heading-dropdown-menu';
import { ListDropdownMenu } from './list-dropdown-menu';
import { UndoRedoButton } from './undo-redo-button';

const ToolbarGroup = ({ children }: ChildrenProps) => {
	return <div className="flex items-center gap-0.5">{children}</div>;
};

const ToolbarSeparator = () => {
	return <Separator className="!h-6" orientation="vertical" />;
};

const FixedToolbarContent = () => {
	return (
		<>
			<Spacer />
			<ToolbarGroup>
				<UndoRedoButton action="undo" />
				<UndoRedoButton action="redo" />
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<HeadingDropdownMenu />
				<ListDropdownMenu />
				<BlockquoteButton />
				<CodeBlockButton />
			</ToolbarGroup>
			<Spacer />
		</>
	);
};

export const FixedToolbar = () => {
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const isResizing = useNotraSidebar((state) => state.isResizing);

	return (
		<div
			className={cn(
				'fixed top-14 right-0 left-0 z-30 h-11 border-b border-accent bg-background md:left-(--sidebar-width,256px)',
				mobileOpen && 'md:left-0',
				!isResizing && 'transition-[left] duration-250 ease-[ease]'
			)}
		>
			<div className="flex size-full items-center gap-1 px-2">
				<FixedToolbarContent />
			</div>
		</div>
	);
};
