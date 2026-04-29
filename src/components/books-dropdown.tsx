'use client';

import { BookEntity } from '@prisma/client';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { useApp } from '@/contexts/app-context';
import { useGetBook, useGetBooks } from '@/queries/book';

import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from './ui/dropdown-menu';

interface BooksDropdownProps {
	bookId: BookEntity['id'];
}

export const BooksDropdown = ({ bookId }: BooksDropdownProps) => {
	const { data: books } = useGetBooks();
	const { data: book } = useGetBook(bookId);
	const { isDemo } = useApp();

	if (!books || !book) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="ghost">
					<ChevronDown />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				onCloseAutoFocus={(e) => e.preventDefault()}
			>
				{books.map((book) => (
					<Link
						key={book.id}
						href={`/${isDemo ? 'demo' : 'dashboard'}/${book.id}`}
					>
						<DropdownMenuItem>{book.name}</DropdownMenuItem>
					</Link>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
