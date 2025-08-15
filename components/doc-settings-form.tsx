'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookEntity, DocEntity } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
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
import { Input } from '@/components/ui/input';
import { getTranslations } from '@/i18n';
import { mutateCatalog } from '@/stores/catalog';
import { DocSettingsFormSchema, DocSettingsFormValues } from '@/types/doc';

import { useBookSettingsDialog } from './book-settings-dialog';

export interface DocSettingsFormProps {
	docId: DocEntity['id'];
	bookId: DocEntity['id'];
	bookSlug: BookEntity['slug'];
	defaultDocSlug: DocEntity['slug'];
	mutateDocMeta: () => void;
}

const t = getTranslations('components_doc_settings_form');

export default function DocSettingsForm({
	docId,
	bookId,
	bookSlug,
	defaultDocSlug,
	mutateDocMeta
}: Readonly<DocSettingsFormProps>) {
	const [isPending, setIsPending] = useState(false);

	const form = useForm<DocSettingsFormValues>({
		resolver: zodResolver(DocSettingsFormSchema),
		mode: 'onChange',
		defaultValues: {
			slug: defaultDocSlug
		}
	});
	const router = useRouter();
	const pathname = usePathname();
	const setDocSlug = useBookSettingsDialog((state) => state.setDocSlug);

	const onSubmit = async (values: DocSettingsFormValues) => {
		setIsPending(true);

		const promise = (async () => {
			if (values.slug !== defaultDocSlug) {
				const checkResult = await checkDocSlug(bookSlug, values.slug);

				if (checkResult.success && !checkResult.data) {
					form.setError('slug', { message: t.slug_exists });
					setIsPending(false);

					throw new Error(t.slug_exists);
				}
			}

			const result = await updateDocMeta({ id: docId, slug: values.slug });

			if (!result.success) {
				throw new Error(result.message);
			}

			setDocSlug(values.slug);
			mutateDocMeta();
			mutateCatalog(bookId);

			if (values.slug !== defaultDocSlug) {
				router.replace(pathname.replace(defaultDocSlug, values.slug));
			}
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
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.slug}</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled={isPending}
									placeholder={defaultDocSlug}
									onChange={(e) => {
										form.clearErrors('slug');
										field.onChange(e);
									}}
								/>
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
