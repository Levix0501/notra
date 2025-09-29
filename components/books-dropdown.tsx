'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { useGetBooks } from '@/queries/book';

import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from './ui/dropdown-menu';

export const BooksDropdown = () => {
	const { data: books } = useGetBooks();

	if (!books) {
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
					<Link key={book.id} href={`/dashboard/${book.id}`}>
						<DropdownMenuItem>{book.name}</DropdownMenuItem>
					</Link>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
