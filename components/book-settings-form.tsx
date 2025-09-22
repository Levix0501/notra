'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookEntity } from '@prisma/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { checkBookSlug, updateBook } from '@/actions/book';
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
import { useGetBooks } from '@/queries/book';
import { UpdateBookInfoSchema, UpdateBookInfoValues } from '@/types/book';

export interface BookSettingsFormProps {
	bookId: BookEntity['id'];
	defaultName: string;
	defaultSlug: string;
	mutateBook: () => void;
}

const t = getTranslations('components_book_settings_form');

export default function BookSettingsForm({
	bookId,
	defaultName,
	defaultSlug,
	mutateBook
}: Readonly<BookSettingsFormProps>) {
	const [isPending, setIsPending] = useState(false);

	const form = useForm<UpdateBookInfoValues>({
		resolver: zodResolver(UpdateBookInfoSchema),
		mode: 'onChange',
		defaultValues: {
			name: defaultName,
			slug: defaultSlug
		}
	});
	const { mutate: mutateBooks } = useGetBooks();

	const onSubmit = async (values: UpdateBookInfoValues) => {
		setIsPending(true);

		const promise = (async () => {
			if (values.slug !== defaultSlug) {
				const checkResult = await checkBookSlug(values.slug);

				if (checkResult.success && !checkResult.data) {
					form.setError('slug', { message: t.slug_exists });
					setIsPending(false);

					throw new Error(t.slug_exists);
				}
			}

			const updateResult = await updateBook({
				...values,
				id: bookId
			});

			if (!updateResult.success) {
				throw new Error(updateResult.message);
			}

			form.reset({
				name: values.name,
				slug: values.slug
			});

			mutateBook();
			mutateBooks();
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
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.name}</FormLabel>
							<FormControl>
								<Input {...field} disabled={isPending} />
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
								<Input {...field} disabled={isPending} />
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
