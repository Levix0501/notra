import * as TabsPrimitive from '@radix-ui/react-tabs';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { XIcon } from 'lucide-react';

import { ChildrenProps } from '@/types/common';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from './ui/dialog';
import { Tabs, TabsContent, TabsList } from './ui/tabs';

export interface SettingsDialogProps extends ChildrenProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({
	open,
	children,
	onOpenChange
}: SettingsDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="block max-h-[85vh] overflow-hidden p-0 focus-visible:outline-0 max-md:min-h-[60vh] md:h-[600px] md:max-w-[680px]"
				showCloseButton={false}
				onCloseAutoFocus={(e) => e.preventDefault()}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<VisuallyHidden asChild>
						<DialogTitle>Settings</DialogTitle>
					</VisuallyHidden>
					<VisuallyHidden asChild>
						<DialogDescription>Settings</DialogDescription>
					</VisuallyHidden>
				</DialogHeader>

				{children}
			</DialogContent>
		</Dialog>
	);
}

export interface SettingsTabsProps extends ChildrenProps {
	defaultValue: string;
}

export function SettingsTabs({ defaultValue, children }: SettingsTabsProps) {
	return (
		<Tabs
			className="flex h-full flex-col gap-0 md:flex-row"
			defaultValue={defaultValue}
		>
			{children}
		</Tabs>
	);
}

export function SettingsTabsList({ children }: ChildrenProps) {
	return (
		<TabsList className="flex h-full shrink-0 flex-row flex-wrap items-stretch justify-start rounded-none border-elevated-border bg-elevated p-0 text-elevated-foreground select-none max-md:overflow-x-auto max-md:border-b max-md:p-1.5 md:max-w-[200px] md:flex-col md:border-e dark:bg-black/10">
			{children}
		</TabsList>
	);
}

export interface CloseButtonProps {
	onClick: () => void;
}

export function CloseButton({ onClick }: CloseButtonProps) {
	return (
		<div className="w-full py-3 ps-2.5 max-md:hidden">
			<button
				className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-transparent hover:bg-elevated-hover focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent focus-visible:outline-hidden"
				onClick={onClick}
			>
				<XIcon size={20} />
			</button>
		</div>
	);
}

export interface SettingsTabsTriggerProps extends ChildrenProps {
	value: string;
}

export function SettingsTabsTrigger({
	children,
	value
}: SettingsTabsTriggerProps) {
	return (
		<TabsPrimitive.Trigger
			className="mx-1.5 flex w-auto cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-start text-sm font-medium whitespace-nowrap text-primary transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-elevated-hover md:pe-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
			value={value}
		>
			{children}
		</TabsPrimitive.Trigger>
	);
}

export interface SettingsTabsContentProps extends ChildrenProps {
	value: string;
}

export function SettingsTabsContent({
	children,
	value
}: SettingsTabsContentProps) {
	return (
		<TabsContent className="px-4 py-5 text-sm md:min-h-[380px]" value={value}>
			{children}
		</TabsContent>
	);
}
