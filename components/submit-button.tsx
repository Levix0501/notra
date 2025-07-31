'use client';

import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ChildrenProps } from '@/types/common';

import { Button } from './ui/button';

export interface SubmitButtonProps extends ChildrenProps {
	isPending: boolean;
	className?: string;
	disabled?: boolean;
	onClick?: () => void;
}

export function SubmitButton({
	children,
	isPending,
	className,
	disabled,
	onClick
}: Readonly<SubmitButtonProps>) {
	return (
		<Button
			aria-disabled={isPending}
			className={cn('cursor-pointer w-full h-8', className)}
			disabled={disabled || isPending}
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
