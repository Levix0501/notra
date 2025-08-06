'use client';

import {
	CreateBookDialog,
	useCreateBookDialog
} from '@/components/create-book-dialog';
import { Button } from '@/components/ui/button';

export default function CreateBookTest() {
	const setOpen = useCreateBookDialog((state) => state.setOpen);

	return (
		<>
			<Button onClick={() => setOpen(true)}>Create</Button>
			<CreateBookDialog />
		</>
	);
}
