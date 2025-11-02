'use client';

import { BookEntity, DocEntity } from '@prisma/client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { getTranslations } from '@/i18n';

interface EditButtonProps {
	bookId: BookEntity['id'];
	docId: DocEntity['id'];
}

const t = getTranslations('components_edit_button');

export const EditButton = ({ bookId, docId }: EditButtonProps) => {
	const { data } = useSession();

	if (!data) {
		return null;
	}

	return (
		<Link className="text-sm" href={`/dashboard/${bookId}/${docId}`}>
			{t.edit}
		</Link>
	);
};
