'use client';

import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ChildrenProps } from '@/types/common';

import { Button } from './ui/button';

export interface SubmitButtonProps extends ChildrenProps {
	isPending: boolean;
	className?: string;
	disabled?: boolean;
	size?: 'default' | 'sm' | 'lg' | 'icon';
	onClick?: () => void;
}

export function SubmitButton({
	children,
	isPending,
	className,
	disabled,
	size,
	onClick
}: Readonly<SubmitButtonProps>) {
	return (
		<Button
			aria-disabled={isPending}
			className={cn('h-8 w-full cursor-pointer', className)}
			disabled={disabled || isPending}
			size={size}
			type={isPending || onClick ? 'button' : 'submit'}
			onClick={onClick}
		>
			{isPending && <Loader2 className="animate-spin" />}
			{children}
			<span aria-live="polite" className="sr-only">
				{isPending ? 'Loading' : 'Submit form'}
			</span>
		</Button>
	);
}
