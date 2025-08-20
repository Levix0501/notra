'use client';

import { BookEntity } from '@prisma/client';
import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useGlobalSettingsDialog } from './global-settings-dialog';

interface BookSettingsButtonProps {
	bookSlug: BookEntity['slug'];
}

export default function BookSettingsButton({
	bookSlug
}: Readonly<BookSettingsButtonProps>) {
	const handleClick = () => {
		useGlobalSettingsDialog.setState({
			open: true,
			tab: 'book',
			bookSlug,
			docSlug: ''
		});
	};

	return (
		<Button
			className="size-7"
			size="icon"
			variant="ghost"
			onClick={handleClick}
		>
			<SlidersHorizontal size={16} />
			<span className="sr-only">Settings</span>
		</Button>
	);
}
