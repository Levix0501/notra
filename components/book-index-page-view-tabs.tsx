'use client';

import { IndexPageType } from '@prisma/client';
import { LayoutGrid, Text } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { updateBook } from '@/actions/book';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';
import { useGetBook } from '@/queries/book';
import { BookVo } from '@/types/book';

import EmptyState from './empty-state';
import IndexPageDocForm, {
	IndexPageDocFormHandle
} from './index-page-doc-form';
import IndexPageDocView from './index-page-doc-view';

export interface BookIndexPageViewTabsProps {
	defaultBook: BookVo;
}

const t = getTranslations('components_book_index_page_view_tabs');

export default function BookIndexPageViewTabs({
	defaultBook
}: Readonly<BookIndexPageViewTabsProps>) {
	const formRef = useRef<IndexPageDocFormHandle>(null);

	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [indexPageType, setIndexPageType] = useState<IndexPageType>(
		defaultBook.indexPageType
	);

	const { data: book, mutate } = useGetBook(defaultBook.slug, defaultBook);

	const defaultValues = useMemo(() => {
		return {
			indexTitle: book?.indexTitle ?? '',
			indexDescription: book?.indexDescription ?? '',
			mainActionText: book?.mainActionText ?? '',
			mainActionUrl: book?.mainActionUrl ?? '',
			subActionText: book?.subActionText ?? '',
			subActionUrl: book?.subActionUrl ?? '',
			isMainNewTab: book?.isMainNewTab ?? false,
			isSubNewTab: book?.isSubNewTab ?? false
		};
	}, [book]);

	if (!book) {
		return null;
	}

	const handleValueChange = async (value: string) => {
		setIndexPageType(value as IndexPageType);
	};

	const handleUpdate = () => {
		setIsSubmitting(true);

		mutate(
			async () => {
				const result = await updateBook({
					id: book.id,
					indexPageType,
					...formRef.current?.form.getValues()
				});

				if (!result.success || !result.data) {
					toast.error(t.update_error);
					setIsSubmitting(false);

					throw new Error(result.message);
				}

				toast.success(t.update_success);
				setIsEditing(false);
				setIsSubmitting(false);

				return result.data;
			},
			{
				optimisticData: {
					...book,
					indexPageType,
					...formRef.current?.form.getValues()
				},
				rollbackOnError: true,
				revalidate: false
			}
		);
	};

	return (
		<Tabs
			className="gap-4"
			value={indexPageType}
			onValueChange={handleValueChange}
		>
			<div className="flex items-center justify-between">
				<TabsList className={cn(!isEditing && 'invisible')}>
					<TabsTrigger
						className="cursor-pointer text-muted-foreground data-[state=active]:text-foreground"
						value={IndexPageType.DOC}
					>
						<Text /> {t.doc_view}
					</TabsTrigger>
					<TabsTrigger
						className="cursor-pointer text-muted-foreground data-[state=active]:text-foreground"
						value={IndexPageType.CARD}
					>
						<LayoutGrid /> {t.card_view}
					</TabsTrigger>
				</TabsList>

				<Button
					disabled={isSubmitting}
					size="sm"
					variant="outline"
					onClick={() => (isEditing ? handleUpdate() : setIsEditing(true))}
				>
					{isEditing ? t.update : t.edit_index_page}
				</Button>
			</div>

			<TabsContent value={IndexPageType.DOC}>
				{isEditing ? (
					<IndexPageDocForm ref={formRef} defaultValues={defaultValues} />
				) : (
					<IndexPageDocView {...defaultValues} />
				)}
			</TabsContent>
			<TabsContent value={IndexPageType.CARD}>
				<EmptyState content={t.no_docs_found} />
			</TabsContent>
		</Tabs>
	);
}
