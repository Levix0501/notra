'use client';

import { BookEntity, DocEntity } from '@prisma/client';
import { InputJsonValue, JsonValue } from '@prisma/client/runtime/library';
import { Value } from 'platejs';
import { useDebounceCallback } from 'usehooks-ts';

import { updateDocDraftContent } from '@/actions/doc';
import { EditorCore } from '@/components/editor/editor-core';
import { useGetDoc } from '@/queries/doc';
import { useCurrentDocMeta, useDocStore } from '@/stores/doc';

export interface NotraEditorProps {
	bookSlug: BookEntity['slug'];
	docSlug: DocEntity['slug'];
}

export default function NotraEditor({
	bookSlug,
	docSlug
}: Readonly<NotraEditorProps>) {
	const setIsSaving = useDocStore((state) => state.setIsSaving);
	const setUpdateAt = useDocStore((state) => state.setUpdateAt);
	const { data: doc, mutate } = useGetDoc({ book: bookSlug, doc: docSlug });
	const { mutate: mutateDocMeta } = useCurrentDocMeta();
	const debouncedUpdateDocDraftContent = useDebounceCallback(
		async (value: Value) => {
			if (!doc) return;

			mutate(
				async () => {
					setIsSaving(true);
					const result = await updateDocDraftContent({
						id: doc.id,
						draftContent: value as unknown as InputJsonValue
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
						draftContent: value as unknown as JsonValue
					}
				}
			);
		},
		3000
	);

	const handleValueChange = (value: Value) => {
		debouncedUpdateDocDraftContent(value);
	};

	return (
		<div className="h-[calc(100dvh-3.5rem)] w-full">
			<EditorCore
				initialValue={
					doc?.draftContent ? (doc.draftContent as unknown as Value) : void 0
				}
				onValueChange={handleValueChange}
			/>
		</div>
	);
}
