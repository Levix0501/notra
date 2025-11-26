'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookEntity, DocEntity, FileEntity } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import limax from 'limax';
import { Sparkles, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { checkDocSlug, updateDocMeta } from '@/actions/doc';
import { SubmitButton } from '@/components/submit-button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { useApp } from '@/contexts/app-context';
import { getTranslations } from '@/i18n';
import { uploadFile } from '@/lib/utils';
import { useGetDoc } from '@/queries/doc';
import { DemoService } from '@/services/demo';
import { BOOK_CATALOG_MAP, mutateTree } from '@/stores/tree';
import { DocSettingsFormSchema, DocSettingsFormValues } from '@/types/doc';

import { ImageCropper } from './image-cropper';
import { Button } from './ui/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea
} from './ui/input-group';

export interface DocSettingsFormProps {
	docId: DocEntity['id'];
	bookId: DocEntity['id'];
	bookSlug: BookEntity['slug'];
	defaultDocCover: DocEntity['cover'];
	defaultDocSummary: DocEntity['summary'];
	defaultDocSlug: DocEntity['slug'];
	title: DocEntity['title'];
	mutateDocMeta: () => void;
}

const t = getTranslations('components_doc_settings_form');

export function DocSettingsForm({
	docId,
	bookId,
	bookSlug,
	defaultDocCover,
	defaultDocSummary,
	defaultDocSlug,
	title,
	mutateDocMeta
}: Readonly<DocSettingsFormProps>) {
	const [isPending, setIsPending] = useState(false);

	const form = useForm<DocSettingsFormValues>({
		resolver: zodResolver(DocSettingsFormSchema),
		mode: 'onChange',
		defaultValues: {
			cover: void 0,
			summary: defaultDocSummary ?? '',
			slug: defaultDocSlug
		}
	});
	const { data: doc } = useGetDoc(docId);
	const { isDemo } = useApp();

	const onSubmit = async (values: DocSettingsFormValues) => {
		setIsPending(true);

		const promise = (async () => {
			if (values.slug !== defaultDocSlug) {
				const checkResult = isDemo
					? await DemoService.checkDocSlug({
							bookId,
							docSlug: values.slug
						})
					: await checkDocSlug({
							bookId,
							docSlug: values.slug
						});

				if (checkResult.success && !checkResult.data) {
					form.setError('slug', { message: t.slug_exists });
					setIsPending(false);

					throw new Error(t.slug_exists);
				}
			}

			let cover: FileEntity | undefined;

			if (values.cover) {
				cover = isDemo
					? await DemoService.uploadFile(values.cover)
					: await uploadFile(values.cover);
			}

			const result = await (isDemo ? DemoService.updateDocMeta : updateDocMeta)(
				{
					id: docId,
					cover: values.cover === null ? null : cover?.url,
					summary: values.summary,
					slug: values.slug
				}
			);

			if (!result.success) {
				throw new Error(result.message);
			}

			form.reset({
				cover: void 0,
				summary: values.summary,
				slug: values.slug
			});

			mutateDocMeta();
			mutateTree(bookId, BOOK_CATALOG_MAP, isDemo);
		})();

		toast
			.promise(promise, {
				loading: t.update_loading,
				success: t.update_success,
				error: t.update_error
			})
			.unwrap()
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setIsPending(false);
			});
	};

	return (
		<Form {...form}>
			<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="cover"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.cover}</FormLabel>
							<ImageCropper
								aspectRatio={16 / 9}
								defaultImage={defaultDocCover}
								disabled={isPending}
								placeholder={
									<div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
										<Upload size={20} />
										<p>{t.cover_placeholder}</p>
									</div>
								}
								title={t.cover}
								onCrop={(croppedFile) => {
									field.onChange(croppedFile);
								}}
							/>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="summary"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.summary}</FormLabel>
							<FormControl>
								<InputGroup>
									<InputGroupTextarea {...field} disabled={isPending} />
									<InputGroupAddon align="inline-end">
										<Button
											disabled={!doc}
											size="icon"
											type="button"
											variant="ghost"
											onClick={() => {
												if (doc) {
													field.onChange(
														extractTextFromTiptap(doc.content as JSONContent)
													);
												}
											}}
										>
											<Sparkles />
										</Button>
									</InputGroupAddon>
								</InputGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.slug}</FormLabel>
							<FormControl>
								<InputGroup>
									<InputGroupInput
										className="!pl-0"
										{...field}
										disabled={isPending}
										onChange={(e) => {
											form.clearErrors('slug');
											field.onChange(e);
										}}
									/>
									<InputGroupAddon className="max-w-2/5 gap-0">
										<InputGroupText className="inline-block flex-1 truncate">
											{typeof window !== 'undefined'
												? window.location.origin + '/' + bookSlug
												: '/' + bookSlug}
										</InputGroupText>
										<InputGroupText>/</InputGroupText>
									</InputGroupAddon>
									<InputGroupAddon align="inline-end">
										<Button
											size="icon"
											type="button"
											variant="ghost"
											onClick={() =>
												field.onChange(limax(title, { tone: false }))
											}
										>
											<Sparkles />
										</Button>
									</InputGroupAddon>
								</InputGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<SubmitButton
					className="w-auto"
					disabled={
						!form.formState.isDirty || Boolean(form.formState.errors.slug)
					}
					isPending={isPending}
				>
					{t.update}
				</SubmitButton>
			</form>
		</Form>
	);
}

const extractTextFromTiptap = (json: JSONContent) => {
	let result = '';

	function recur(node: JSONContent) {
		if (!node || result.length > 120) {
			return;
		}

		if (node.type === 'text' && node.text) {
			result += node.text;

			return;
		}

		if (Array.isArray(node.content)) {
			node.content.forEach((child) => recur(child));
			result += ' ';
		}
	}

	recur(json);

	return result.length > 120 ? result.slice(0, 120) : result;
};
