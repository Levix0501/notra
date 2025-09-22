'use client';

import { BookEntity } from '@prisma/client';
import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useGlobalSettingsDialog } from './global-settings-dialog';

interface BookSettingsButtonProps {
	bookId: BookEntity['id'];
}

export default function BookSettingsButton({
	bookId
}: Readonly<BookSettingsButtonProps>) {
	const handleClick = () => {
		useGlobalSettingsDialog.setState({
			open: true,
			tab: 'book',
			bookId,
			docId: null
		});
	};

	return (
		<Button size="icon" variant="ghost" onClick={handleClick}>
			<SlidersHorizontal />
			<span className="sr-only">Settings</span>
		</Button>
	);
}
