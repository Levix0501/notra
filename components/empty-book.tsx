'use client';
import { BookEntity } from '@prisma/client';
import { FileText } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from '@/components/ui/empty';
import { useCreateCatalogItem } from '@/hooks/use-create-catalog-item';
import { getTranslations } from '@/i18n';

interface EmptyBookProps {
	bookId: BookEntity['id'];
}

const t = getTranslations('components_empty_book');

export function EmptyBook({ bookId }: EmptyBookProps) {
	const [isCreating, setIsCreating] = useState(false);
	const createCatalogItem = useCreateCatalogItem({
		bookId,
		parentTreeNodeId: null
	});

	const handleCreateDoc = async () => {
		setIsCreating(true);

		try {
			await createCatalogItem?.('DOC');
		} catch {
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<FileText />
				</EmptyMedia>
				<EmptyTitle>{t.no_documents}</EmptyTitle>
				<EmptyDescription>{t.no_documents_description}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button
					disabled={!createCatalogItem || isCreating}
					onClick={handleCreateDoc}
				>
					{t.create_document}
				</Button>
			</EmptyContent>
		</Empty>
	);
}
