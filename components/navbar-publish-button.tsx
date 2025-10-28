'use client';

import { BookEntity } from '@prisma/client';
import { useState } from 'react';
import { toast } from 'sonner';

import { publishNavbar } from '@/actions/tree-node';
import { getTranslations } from '@/i18n';
import { mutateTree } from '@/stores/tree';

import { SubmitButton } from './submit-button';

const t = getTranslations('components_navbar_publish_button');

export const NavbarPublishButton = ({
	bookId
}: {
	bookId: BookEntity['id'];
}) => {
	const [isPending, setIsPending] = useState(false);

	const handlePublish = () => {
		setIsPending(true);
		const promise = (async () => {
			const result = await publishNavbar(bookId);

			if (!result.success) {
				setIsPending(false);

				throw new Error(result.message);
			}

			setIsPending(false);
			mutateTree(bookId);
		})();

		toast.promise(promise, {
			loading: t.publish_loading,
			success: t.publish_success,
			error: t.publish_error
		});
	};

	return (
		<SubmitButton
			className="w-auto"
			isPending={isPending}
			onClick={handlePublish}
		>
			{t.publish}
		</SubmitButton>
	);
};
