'use client';

import { FileSliders } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCurrentDocMeta } from '@/stores/doc';

import { useBookSettingsDialog } from './book-settings-dialog';

export default function DocSettingsButton() {
	const { data: docMeta } = useCurrentDocMeta();

	if (!docMeta) {
		return null;
	}

	const handleClick = () => {
		useBookSettingsDialog.setState({
			tab: 'doc',
			docSlug: docMeta.slug,
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
