'use client';

import { Settings2 } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useGetBook } from '@/queries/book';

import { useBookSettingsDialog } from './book-settings-dialog';

interface BookSettingsButtonProps {
	bookSlug: string;
}

export default function BookSettingsButton({
	bookSlug
}: Readonly<BookSettingsButtonProps>) {
	const setOpen = useBookSettingsDialog((state) => state.setOpen);

	useGetBook(bookSlug);
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
			<Settings2 size={16} />
			<span className="sr-only">Settings</span>
		</Button>
	);
}
