'use client';

import { Check, Copy } from 'lucide-react';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';

interface CopyButtonProps {
	value: string;
	className?: string;
}

export const CopyButton = ({ value, className }: CopyButtonProps) => {
	const { isCopied, copyToClipboard } = useCopyToClipboard();

	const handleCopy = () => {
		copyToClipboard(value);
	};

	return (
		<Button
			className={cn('size-7', className)}
			size="icon"
			variant="ghost"
			onClick={handleCopy}
		>
			<span className="sr-only">Copy</span>
			{isCopied ? <Check /> : <Copy />}
		</Button>
	);
};
