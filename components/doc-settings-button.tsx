'use client';

import { BookEntity } from '@prisma/client';
import { FileSliders } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getTranslations } from '@/i18n';
import { useGetBook } from '@/queries/book';
import { useCurrentDocMeta } from '@/stores/doc';

import { useDocSettingsSheet } from './doc-settings-sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface DocSettingsButtonProps {
	bookId: BookEntity['id'];
}

const t = getTranslations('components_doc_settings_button');

export function DocSettingsButton({
	bookId
}: Readonly<DocSettingsButtonProps>) {
	const { data: docMeta } = useCurrentDocMeta();
	const { data: book } = useGetBook(bookId);

	if (!docMeta || !book) {
		return null;
	}

	const handleClick = () => {
		useDocSettingsSheet.setState({
			open: true,
			docId: docMeta.id
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
