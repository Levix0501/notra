'use client';

import { BookEntity, DocEntity } from '@prisma/client';
import { Content } from '@tiptap/react';
import { useDebounceCallback } from 'usehooks-ts';

import { updateDocDraftContent } from '@/actions/doc';
import { useGetDoc } from '@/queries/doc';
import { useCurrentDocMeta, useDocStore } from '@/stores/doc';

import { EditorCore } from './editor/editor-core';

export interface NotraEditorProps {
	bookId: BookEntity['id'];
	docId: DocEntity['id'];
}

export default function NotraEditor({
	bookId,
	docId
}: Readonly<NotraEditorProps>) {
	const setIsSaving = useDocStore((state) => state.setIsSaving);
	const setUpdateAt = useDocStore((state) => state.setUpdateAt);
	const { data: doc, mutate } = useGetDoc({ bookId, docId });
	const { mutate: mutateDocMeta } = useCurrentDocMeta();
	const debouncedUpdateDocDraftContent = useDebounceCallback(
		async (content: Content) => {
			if (!doc) {
				return;
			}

			mutate(
				async () => {
					setIsSaving(true);
					const result = await updateDocDraftContent({
						id: doc.id,
						draftContent: JSON.stringify(content)
					});

					if (!result.success || !result.data) {
						throw new Error(result.message);
					}

					mutateDocMeta();
					setIsSaving(false);
					setUpdateAt(result.data.updatedAt);

					return result.data;
				},
				{
					optimisticData: {
						...doc,
						draftContent: content
					}
				}
			);
		},
		1000
	);

	const handleContentChange = (content: Content) => {
		debouncedUpdateDocDraftContent(content);
	};

	if (!doc) {
		return null;
	}

	return (
		<EditorCore
			initialContent={doc?.draftContent as unknown as Content}
			onContentChange={handleContentChange}
		/>
	);
}
