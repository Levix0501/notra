'use client';

import { BookEntity } from '@prisma/client';
import { Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { publishWithParent, unpublishWithChildren } from '@/actions/tree-node';
import { getTranslations } from '@/i18n';
import { publishNode, unpublishNode } from '@/lib/tree/client';
import { useGetBook } from '@/queries/book';
import { useCurrentDocMeta, useDocStore } from '@/stores/doc';
import { mutateTree, nodeMap } from '@/stores/tree';

import { CopyButton } from './copy-button';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface PublishButtonProps {
	bookId: BookEntity['id'];
}

const t = getTranslations('components_publish_button');

export function PublishButton({ bookId }: Readonly<PublishButtonProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, setIsPending] = useState(false);

	const isSaving = useDocStore((state) => state.isSaving);
	const { data: docMeta, mutate } = useCurrentDocMeta();
	const { data: book } = useGetBook(bookId);

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

		mutateTree(book.id, async () => {
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
		const item = nodeMap.values().find((e) => e.docId === docMeta.id);

		if (!item) {
			return;
		}

		const [nodeIds, docIds] = unpublishNode(nodeMap, item.id);

		mutateTree(book.id, async () => {
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
		<div className="relative size-7">
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<div className="absolute size-7"></div>
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

								<Link
									className="flex-1"
									href={isPending ? '#' : publishedPageUrl}
									target={isPending ? void 0 : '_blank'}
								>
									<Button className="w-full" disabled={isPending} size="sm">
										{t.view_page}
									</Button>
								</Link>
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
			<Tooltip>
				<TooltipTrigger asChild onClick={() => setIsOpen(true)}>
					<Button className="absolute" size="icon" variant="ghost">
						<Send />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{t.share}</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}
