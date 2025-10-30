import { BookEntity, DocEntity } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const revalidateDoc = ({
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

export const revalidateDashboardBook = () => {
	revalidatePath('/dashboard/[bookId]');
};

export const revalidateAll = () => revalidatePath('/', 'layout');
