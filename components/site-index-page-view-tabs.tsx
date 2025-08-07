'use client';

import { IndexPageType } from '@prisma/client';
import { LayoutGrid, Text } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { updateSiteSettings } from '@/actions/site-settings';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';
import { useGetSiteSettings } from '@/queries/site-settings';

import EmptyState from './empty-state';
import IndexPageDocForm, {
	IndexPageDocFormHandle
} from './index-page-doc-form';
import IndexPageDocView from './index-page-doc-view';

const t = getTranslations('components_site_index_page_view_tabs');

export default function SiteIndexPageViewTabs() {
	const formRef = useRef<IndexPageDocFormHandle>(null);

	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [indexPageType, setIndexPageType] = useState<IndexPageType>(
		IndexPageType.DOC
	);

	const { data: siteSettings, mutate } = useGetSiteSettings();

	const defaultValues = useMemo(
		() => ({
			indexTitle: siteSettings?.indexTitle ?? '',
			indexDescription: siteSettings?.indexDescription ?? '',
			mainActionText: siteSettings?.mainActionText ?? '',
			mainActionUrl: siteSettings?.mainActionUrl ?? '',
			subActionText: siteSettings?.subActionText ?? '',
			subActionUrl: siteSettings?.subActionUrl ?? '',
			isMainNewTab: siteSettings?.isMainNewTab ?? false,
			isSubNewTab: siteSettings?.isSubNewTab ?? false
		}),
		[siteSettings]
	);

	useEffect(() => {
		if (siteSettings?.indexPageType) {
			setIndexPageType(siteSettings.indexPageType);
		}
	}, [siteSettings?.indexPageType]);

	if (!siteSettings) {
		return null;
	}

	const handleValueChange = async (value: string) => {
		setIndexPageType(value as IndexPageType);
	};

	const handleUpdate = () => {
		setIsSubmitting(true);

		mutate(
			async () => {
				const promise = (async () => {
					const result = await updateSiteSettings({
						indexPageType: indexPageType,
						...formRef.current?.form.getValues()
					});

					if (!result.success || !result.data) {
						throw new Error(result.message);
					}

					return result.data;
				})();

				try {
					const data = await toast
						.promise(promise, {
							loading: t.update_loading,
							success: t.update_success,
							error: t.update_error
						})
						.unwrap();

					setIsEditing(false);

					return data;
				} catch (error) {
					console.log(error);
				} finally {
					setIsSubmitting(false);
				}
			},
			{
				optimisticData: {
					...siteSettings,
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
					className="cursor-pointer"
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
