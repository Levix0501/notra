'use client';

import { FileSliders } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCurrentBook } from '@/stores/book';
import { useCurrentDocMeta } from '@/stores/doc';

import { useGlobalSettingsDialog } from './global-settings-dialog';

export default function DocSettingsButton() {
	const { data: docMeta } = useCurrentDocMeta();
	const { data: book } = useCurrentBook();

	if (!docMeta || !book) {
		return null;
	}

	const handleClick = () => {
		useGlobalSettingsDialog.setState({
			open: true,
			tab: 'doc',
			docId: docMeta.id,
			bookId: book.id
		});
	};

	return (
		<Button size="icon" variant="ghost" onClick={handleClick}>
			<FileSliders />
		</Button>
	);
}
