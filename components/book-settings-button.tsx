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
		<Button size="icon" variant="ghost" onClick={handleClick}>
			<SlidersHorizontal />
			<span className="sr-only">Settings</span>
		</Button>
	);
}
