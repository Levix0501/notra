'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookEntity, BookType } from '@prisma/client';
import limax from 'limax';
import { Sparkles } from 'lucide-react';
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

import { BookVisibilityRadioGroup } from './book-visibility-radio-group';
import { Button } from './ui/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText
} from './ui/input-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from './ui/select';

export interface BookSettingsFormProps {
	bookId: BookEntity['id'];
	defaultIsPublished: boolean;
	defaultName: string;
	defaultSlug: string;
	defaultType: BookType;
	mutateBook: () => void;
}

const t = getTranslations('components_book_settings_form');

export function BookSettingsForm({
	bookId,
	defaultIsPublished,
	defaultName,
	defaultSlug,
	defaultType,
	mutateBook
}: Readonly<BookSettingsFormProps>) {
	const [isPending, setIsPending] = useState(false);

	const form = useForm<UpdateBookInfoValues>({
		resolver: zodResolver(UpdateBookInfoSchema),
		mode: 'onChange',
		defaultValues: {
			isPublished: defaultIsPublished,
			name: defaultName,
			slug: defaultSlug,
			type: defaultType
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
				isPublished: values.isPublished,
				name: values.name,
				slug: values.slug,
				type: values.type
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
					name="isPublished"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.visibility}</FormLabel>
							<FormControl>
								<BookVisibilityRadioGroup {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

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
											{location.origin}
										</InputGroupText>
										<InputGroupText>/</InputGroupText>
									</InputGroupAddon>
									<InputGroupAddon align="inline-end">
										<Button
											size="icon"
											type="button"
											variant="ghost"
											onClick={() =>
												field.onChange(
													limax(form.watch('name'), { tone: false })
												)
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

				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.type}</FormLabel>
							<FormControl>
								<Select
									{...field}
									disabled={isPending}
									onValueChange={field.onChange}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder={t.type} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="BLOGS">{t.blogs}</SelectItem>
										<SelectItem value="DOCS">{t.docs}</SelectItem>
									</SelectContent>
								</Select>
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
