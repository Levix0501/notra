'use server';

import { BookEntity, DocEntity } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const revalidateDoc = async ({
	bookId,
	bookSlug,
	docId,
	docSlug,
	oldSlug
}: {
	bookId: BookEntity['id'];
	bookSlug: BookEntity['slug'];
	docId: DocEntity['id'];
	docSlug: DocEntity['slug'];
	oldSlug?: string;
}) => {
	revalidatePath(`/`);
	revalidatePath(`/${bookSlug}`);
	revalidatePath(`/${bookSlug}/${docSlug}`);
	revalidatePath(`/dashboard/${bookId}/${docId}`);

	if (oldSlug) {
		revalidatePath(`/${bookSlug}/${oldSlug}`);
	}
};

export const revalidateDashboardBook = async () => {
	revalidatePath('/dashboard/[bookId]');
};

export const revalidateAll = async () => revalidatePath('/', 'layout');
