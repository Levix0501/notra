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
}: Readonly<SettingsDialogProps>) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="block flex max-h-[85vh] flex-col overflow-hidden p-0 focus-visible:outline-0 max-md:min-h-[60vh] md:h-[600px] md:max-w-[680px]"
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
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	value?: string;
}

export function SettingsTabs({
	defaultValue,
	onValueChange,
	children,
	value
}: Readonly<SettingsTabsProps>) {
	return (
		<Tabs
			className="flex min-h-0 flex-1 flex-col gap-0 md:flex-row"
			defaultValue={defaultValue}
			value={value}
			onValueChange={onValueChange}
		>
			{children}
		</Tabs>
	);
}

export function SettingsTabsList({ children }: Readonly<ChildrenProps>) {
	return (
		<TabsList className="flex h-auto w-full shrink-0 flex-row flex-wrap items-stretch justify-start rounded-none border-sidebar-accent bg-sidebar p-0 select-none max-md:overflow-x-auto max-md:border-b max-md:p-1.5 md:max-w-[200px] md:flex-col md:border-r">
			{children}
		</TabsList>
	);
}

export interface CloseButtonProps {
	onClick: () => void;
}

export function CloseButton({ onClick }: Readonly<CloseButtonProps>) {
	return (
		<div className="w-full py-3 ps-2.5 max-md:hidden">
			<button
				className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-transparent hover:bg-accent focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent focus-visible:outline-hidden"
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
}: Readonly<SettingsTabsTriggerProps>) {
	return (
		<TabsPrimitive.Trigger
			className="mx-1.5 flex w-auto cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-start text-sm font-medium whitespace-nowrap text-primary transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-sidebar-accent md:pe-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
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
}: Readonly<SettingsTabsContentProps>) {
	return (
		<TabsContent
			className="overflow-y-auto px-4 py-5 text-sm md:min-h-[380px]"
			value={value}
		>
			{children}
		</TabsContent>
	);
}
