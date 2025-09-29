'use client';

import { FileSliders } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getTranslations } from '@/i18n';
import { useCurrentBook } from '@/stores/book';
import { useCurrentDocMeta } from '@/stores/doc';

import { useGlobalSettingsDialog } from './global-settings-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const t = getTranslations('components_doc_settings_button');

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
		<Tooltip>
			<TooltipTrigger asChild>
				<Button size="icon" variant="ghost" onClick={handleClick}>
					<FileSliders />
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>{t.doc_settings}</p>
			</TooltipContent>
		</Tooltip>
	);
}
