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
import { useCreateTreeNode } from '@/hooks/use-create-tree-node';
import { getTranslations } from '@/i18n';

interface EmptyBookProps {
	bookId: BookEntity['id'];
}

const t = getTranslations('components_empty_book');

export function EmptyBook({ bookId }: EmptyBookProps) {
	const [isCreating, setIsCreating] = useState(false);
	const createTreeNode = useCreateTreeNode({
		bookId,
		parentTreeNodeId: null
	});

	const handleCreateDoc = async () => {
		setIsCreating(true);

		try {
			await createTreeNode?.('DOC');
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
					disabled={!createTreeNode || isCreating}
					onClick={handleCreateDoc}
				>
					{t.create_document}
				</Button>
			</EmptyContent>
		</Empty>
	);
}
