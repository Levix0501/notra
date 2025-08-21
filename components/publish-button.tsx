'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { publishDoc } from '@/actions/doc';
import { SubmitButton } from '@/components/submit-button';
import { getTranslations } from '@/i18n';
import { useCurrentDocMeta, useDocStore } from '@/stores/doc';

const t = getTranslations('components_publish_button');

export default function PublishButton() {
	const [isPending, setIsPending] = useState(false);

	const isSaving = useDocStore((state) => state.isSaving);
	const { data: docMeta, mutate } = useCurrentDocMeta();

	if (!docMeta) {
		return null;
	}

	const handlePublish = async () => {
		setIsPending(true);

		try {
			await publishDoc(docMeta.id);
			mutate();
			toast.success(docMeta.isPublished ? t.update_success : t.publish_success);
		} catch {
			toast.error(docMeta.isPublished ? t.update_error : t.publish_error);
		} finally {
			setIsPending(false);
		}
	};

	return (
		<SubmitButton
			className="w-auto"
			disabled={isSaving || !docMeta.isUpdated}
			isPending={isPending}
			size="sm"
			onClick={handlePublish}
		>
			{docMeta.isPublished ? t.update : t.publish}
		</SubmitButton>
	);
}
