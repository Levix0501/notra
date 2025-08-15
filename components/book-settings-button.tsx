'use client';

import { BookEntity } from '@prisma/client';
import { SlidersHorizontal } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { useBookSettingsDialog } from './book-settings-dialog';

interface BookSettingsButtonProps {
	bookSlug: BookEntity['slug'];
}

export default function BookSettingsButton({
	bookSlug
}: Readonly<BookSettingsButtonProps>) {
	const setOpen = useBookSettingsDialog((state) => state.setOpen);

	useEffect(() => {
		useBookSettingsDialog.setState({
			slug: bookSlug
		});
	}, [bookSlug]);

	const handleClick = () => {
		setOpen(true);
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
