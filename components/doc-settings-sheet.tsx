'use client';

import { DocEntity } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';
import { create } from 'zustand';

import { publishWithParent, unpublishWithChildren } from '@/actions/tree-node';
import { getTranslations } from '@/i18n';
import { publishNode, unpublishNode } from '@/lib/tree/client';
import { useGetBook } from '@/queries/book';
import { useGetDocMeta } from '@/queries/doc';
import { useDocStore } from '@/stores/doc';
import { BOOK_CATALOG_MAP, mutateTree } from '@/stores/tree';
import { Nullable } from '@/types/common';

import { CopyButton } from './copy-button';
import { DocSettingsForm } from './doc-settings-form';
import { NotraSkeleton } from './notra-skeleton';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle
} from './ui/sheet';
import { Skeleton } from './ui/skeleton';

type DocSettingsSheetStore = {
	open: boolean;
	setOpen: (open: boolean) => void;
	docId: Nullable<DocEntity['id']>;
	setDocId: (docId: DocEntity['id']) => void;
};

export const useDocSettingsSheet = create<DocSettingsSheetStore>((set) => ({
	open: false,
	setOpen: (open) => set({ open }),
	docId: null,
	setDocId: (docId) => set({ docId })
}));

const t = getTranslations('components_doc_settings_sheet');

export const DocSettingsSheet = () => {
	const [isPending, setIsPending] = useState(false);

	const { open, setOpen, docId } = useDocSettingsSheet();
	const { data: docMeta, mutate } = useGetDocMeta(docId);
	const isSaving = useDocStore((state) => state.isSaving);
	const { data: book } = useGetBook(docMeta ? docMeta.bookId : null);

	const publishedPageUrl = `${location.origin}/${book?.slug}/${docMeta?.slug}`;

	const handlePublish = async () => {
		if (!docMeta || !book) {
			return;
		}

		const item = BOOK_CATALOG_MAP.values().find((e) => e.docId === docMeta.id);

		if (!item) {
			return;
		}

		const [nodeIds, docIds] = publishNode(BOOK_CATALOG_MAP, item.id);

		mutateTree(book.id, BOOK_CATALOG_MAP, async () => {
			setIsPending(true);
			const result = await publishWithParent({
				nodeIds,
				docIds,
				bookId: book.id,
				bookType: book.type
			});

			if (!result.success || !result.data) {
				setIsPending(false);

				throw new Error(result.message);
			}

			setIsPending(false);

			return result.data;
		});

		mutate(
			async () => ({
				...docMeta,
				isPublished: true
			}),
			{
				optimisticData: {
					...docMeta,
					isPublished: true
				},
				revalidate: false
			}
		);
	};

	const handleUnpublish = async () => {
		if (!docMeta || !book) {
			return;
		}

		const item = BOOK_CATALOG_MAP.values().find((e) => e.docId === docMeta.id);

		if (!item) {
			return;
		}

		const [nodeIds, docIds] = unpublishNode(BOOK_CATALOG_MAP, item.id);

		mutateTree(book.id, BOOK_CATALOG_MAP, async () => {
			setIsPending(true);
			const result = await unpublishWithChildren({
				nodeIds,
				docIds,
				bookId: book.id,
				bookType: book.type
			});

			if (!result.success || !result.data) {
				setIsPending(false);

				throw new Error(result.message);
			}

			setIsPending(false);

			return result.data;
		});

		mutate(
			async () => ({
				...docMeta,
				isPublished: false,
				isUpdated: false
			}),
			{
				optimisticData: {
					...docMeta,
					isPublished: false
				},
				revalidate: false
			}
		);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent
				onCloseAutoFocus={(e) => e.preventDefault()}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<SheetHeader>
					<SheetTitle>{t.doc_settings}</SheetTitle>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto px-4">
					{docMeta ? (
						<DocSettingsForm
							bookId={docMeta.bookId}
							bookSlug={docMeta.book.slug}
							defaultDocCover={docMeta.cover}
							defaultDocSlug={docMeta.slug}
							defaultDocSummary={docMeta.summary}
							docId={docMeta.id}
							mutateDocMeta={mutate}
							title={docMeta.title}
						/>
					) : (
						<NotraSkeleton />
					)}
				</div>

				<SheetFooter>
					{docMeta && book ? (
						docMeta.isPublished ? (
							<div className="flex flex-col items-center gap-4">
								<div className="flex w-full items-center">
									<Input
										disabled
										className="mr-2 h-8 flex-1"
										value={publishedPageUrl}
									/>

									<div>
										<CopyButton value={publishedPageUrl} />
									</div>
								</div>

								<div className="flex w-full items-center gap-2">
									<div className="flex-1">
										<Button
											className="w-full"
											disabled={isPending}
											variant="outline"
											onClick={handleUnpublish}
										>
											{t.unpublish}
										</Button>
									</div>

									<Link
										className="flex-1"
										href={isPending ? '#' : publishedPageUrl}
										target={isPending ? void 0 : '_blank'}
									>
										<Button className="w-full" disabled={isPending}>
											{t.view_page}
										</Button>
									</Link>
								</div>
							</div>
						) : (
							<Button
								className="w-full"
								disabled={isSaving || isPending}
								onClick={handlePublish}
							>
								{t.publish}
							</Button>
						)
					) : (
						<div className="flex flex-col items-center gap-4">
							<Skeleton className="h-8 w-full" />

							<div className="flex w-full gap-2">
								<Skeleton className="h-8 flex-1" />
								<Skeleton className="h-8 flex-1" />
							</div>
						</div>
					)}
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};
