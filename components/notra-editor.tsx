'use client';

import { DocEntity } from '@prisma/client';
import { Content } from '@tiptap/react';
import { useDebounceCallback } from 'usehooks-ts';

import { updateDocContent } from '@/actions/doc';
import { useGetDoc } from '@/queries/doc';
import { useCurrentDocMeta, useDocStore } from '@/stores/doc';

import { EditorCore } from './editor/editor-core';

export interface NotraEditorProps {
	docId: DocEntity['id'];
}

export function NotraEditor({ docId }: Readonly<NotraEditorProps>) {
	const setIsSaving = useDocStore((state) => state.setIsSaving);
	const setUpdateAt = useDocStore((state) => state.setUpdateAt);
	const { data: doc, mutate } = useGetDoc(docId);
	const { mutate: mutateDocMeta } = useCurrentDocMeta();
	const debouncedUpdateDocContent = useDebounceCallback(
		async (content: Content) => {
			if (!doc) {
				return;
			}

			mutate(
				async () => {
					setIsSaving(true);
					const result = await updateDocContent({
						id: doc.id,
						content: JSON.stringify(content)
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
						content: content
					}
				}
			);
		},
		1000
	);

	const handleContentChange = (content: Content) => {
		debouncedUpdateDocContent(content);
	};

	if (!doc) {
		return null;
	}

	return (
		<EditorCore
			initialContent={doc?.content as unknown as Content}
			onContentChange={handleContentChange}
		/>
	);
}
