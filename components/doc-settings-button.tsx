'use client';

import { FileSliders } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useGetDocMeta } from '@/queries/doc';
import { useCurrentBook } from '@/stores/book';
import useDoc from '@/stores/doc';

import { useBookSettingsDialog } from './book-settings-dialog';

export default function DocSettingsButton() {
	const { data: book } = useCurrentBook();
	const slug = useDoc((state) => state.slug);
	const { data } = useGetDocMeta({ book: book?.slug, doc: slug });

	if (!slug || !data) {
		return null;
	}

	const handleClick = () => {
		useBookSettingsDialog.setState({
			tab: 'doc',
			docSlug: slug,
			open: true
		});
	};

	return (
		<Button
			className="size-7"
			size="icon"
			variant="ghost"
			onClick={handleClick}
		>
			<FileSliders />
		</Button>
	);
}
