'use client';

import { Link2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
	publishWithParent,
	unpublishWithChildren
} from '@/actions/catalog-node';
import { getTranslations } from '@/i18n';
import { publishNode, unpublishNode } from '@/lib/catalog/client';
import { useCurrentBook } from '@/stores/book';
import { mutateCatalog, nodeMap } from '@/stores/catalog';
import { useCurrentDocMeta, useDocStore } from '@/stores/doc';

import { CopyButton } from './copy-button';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const t = getTranslations('components_publish_button');

export function PublishButton() {
	const [isPending, setIsPending] = useState(false);

	const isSaving = useDocStore((state) => state.isSaving);
	const { data: docMeta, mutate } = useCurrentDocMeta();
	const { data: book } = useCurrentBook();

	if (!docMeta || !book) {
		return null;
	}

	const publishedPageUrl = `${location.origin}/${book.slug}/${docMeta.slug}`;

	const handlePublish = async () => {
		const item = nodeMap.values().find((e) => e.docId === docMeta.id);

		if (!item) {
			return;
		}

		const [nodeIds, docIds] = publishNode(nodeMap, item.id);

		mutateCatalog(book.id, async () => {
			setIsPending(true);
			const result = await publishWithParent({
				nodeIds,
				docIds,
				bookId: book.id
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
				isPublished: true,
				isUpdated: false
			}),
			{
				optimisticData: {
					...docMeta,
					isPublished: true,
					isUpdated: false
				},
				revalidate: false
			}
		);
	};

	const handleUnpublish = async () => {
		const item = nodeMap.values().find((e) => e.docId === docMeta.id);

		if (!item) {
			return;
		}

		const [nodeIds, docIds] = unpublishNode(nodeMap, item.id);

		mutateCatalog(book.id, async () => {
			setIsPending(true);
			const result = await unpublishWithChildren({
				nodeIds,
				docIds,
				bookId: book.id
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

	const handleUpdate = () => {
		handlePublish();
	};

	const renderButtonText = () => {
		if (docMeta.isPublished) {
			return docMeta.isUpdated ? t.update : t.share;
		}

		return t.publish;
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="w-auto" size="sm" variant="outline">
					{renderButtonText()}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-80">
				{docMeta.isPublished ? (
					<div className="flex flex-col items-center gap-4">
						<div className="mt-2 flex w-full items-center">
							<Input
								disabled
								className="mr-2 h-8 flex-1"
								value={publishedPageUrl}
							/>

							<div>
								<CopyButton value={publishedPageUrl} />

								<Link
									href={isPending ? '#' : publishedPageUrl}
									target={isPending ? void 0 : '_blank'}
								>
									<Button size="icon" variant="ghost">
										<Link2 />
									</Button>
								</Link>
							</div>
						</div>

						<div className="flex w-full items-center gap-2">
							<div className="flex-1">
								<Button
									className="w-full"
									disabled={isPending}
									size="sm"
									variant="outline"
									onClick={handleUnpublish}
								>
									{t.unpublish}
								</Button>
							</div>

							{docMeta.isUpdated ? (
								<div className="flex-1">
									<Button
										className="w-full"
										disabled={isSaving || isPending}
										size="sm"
										onClick={handleUpdate}
									>
										{t.update}
									</Button>
								</div>
							) : (
								<Link
									className="flex-1"
									href={isPending ? '#' : publishedPageUrl}
									target={isPending ? void 0 : '_blank'}
								>
									<Button className="w-full" disabled={isPending} size="sm">
										{t.view_page}
									</Button>
								</Link>
							)}
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center gap-4">
						<p className="mt-2 font-semibold">{t.publish_to_web}</p>

						<Button
							className="w-full"
							disabled={isSaving || isPending}
							size="sm"
							onClick={handlePublish}
						>
							{t.publish}
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
