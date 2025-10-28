'use client';

import { EyeOff, Globe } from 'lucide-react';

import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

interface BookVisibilityRadioGroupProps {
	value: boolean;
	onChange: (value: boolean) => void;
}

const t = getTranslations('components_book_visibility_radio_group');

export const BookVisibilityRadioGroup = ({
	value,
	onChange
}: BookVisibilityRadioGroupProps) => {
	return (
		<div className="flex w-full flex-col gap-2">
			<div
				className={cn(
					'flex w-full cursor-pointer gap-2 rounded-md border border-input p-3 text-muted-foreground',
					value && 'border-primary'
				)}
				onClick={() => onChange(true)}
			>
				<div className="size-9 rounded-full bg-accent p-2">
					<Globe size={20} />
				</div>

				<div>
					<p className="text-base font-medium text-foreground"> {t.public}</p>
					<p className="text-sm text-muted-foreground">
						{t.public_description}
					</p>
				</div>
			</div>
			<div
				className={cn(
					'flex w-full cursor-pointer gap-2 rounded-md border border-input p-3 text-muted-foreground',
					!value && 'border-primary'
				)}
				onClick={() => onChange(false)}
			>
				<div className="size-9 rounded-full bg-accent p-2">
					<EyeOff size={20} />
				</div>

				<div>
					<p className="text-base font-medium text-foreground"> {t.hidden}</p>
					<p className="text-sm text-muted-foreground">
						{t.hidden_description}
					</p>
				</div>
			</div>
		</div>
	);
};
