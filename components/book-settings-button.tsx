'use client';

import { BookEntity } from '@prisma/client';
import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useGetBook } from '@/queries/book';

import { useBookSettingsSheet } from './book-settings-sheet';

interface BookSettingsButtonProps {
	bookId: BookEntity['id'];
}

export function BookSettingsButton({
	bookId
}: Readonly<BookSettingsButtonProps>) {
	const { data: book } = useGetBook(bookId);

	if (!book) {
		return <div className="size-7"></div>;
	}

	const handleClick = () => {
		useBookSettingsSheet.setState({
			open: true,
			bookId
		});
	};

	return (
		<Button size="icon" variant="ghost" onClick={handleClick}>
			<SlidersHorizontal />
			<span className="sr-only">Settings</span>
		</Button>
	);
}
