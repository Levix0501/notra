'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateSiteSettings } from '@/actions/site-settings';
import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '@/components/ui/command';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';
import { useGetBooks } from '@/queries/book';
import { useGetAllDocsMeta } from '@/queries/doc';
import {
	HomePageRedirectFormSchema,
	HomePageRedirectFormValues
} from '@/types/site-settings';

interface SiteSettingsFormProps extends HomePageRedirectFormValues {
	mutateSiteSettings: () => void;
}

const t = getTranslations('components_home_page_redirect_form');

export function HomePageRedirectForm({
	homePageRedirectType,
	redirectToBookId,
	redirectToDocId,
	mutateSiteSettings
}: Readonly<SiteSettingsFormProps>) {
	const [isPending, setIsPending] = useState(false);

	const form = useForm<HomePageRedirectFormValues>({
		resolver: zodResolver(HomePageRedirectFormSchema),
		defaultValues: {
			homePageRedirectType: homePageRedirectType,
			redirectToBookId: redirectToBookId,
			redirectToDocId: redirectToDocId
		}
	});

	const onSubmit = async (values: HomePageRedirectFormValues) => {
		setIsPending(true);

		const promise = (async () => {
			const result = await updateSiteSettings({
				homePageRedirectType: values.homePageRedirectType,
				redirectToBookId: values.redirectToBookId,
				redirectToDocId: values.redirectToDocId
			});

			if (!result.success) {
				throw new Error(result.message);
			}

			form.reset({
				homePageRedirectType: values.homePageRedirectType,
				redirectToBookId: values.redirectToBookId,
				redirectToDocId: values.redirectToDocId
			});

			mutateSiteSettings();
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
					name="homePageRedirectType"
					render={() => (
						<FormItem>
							<FormLabel>{t.home_page_redirect_to}</FormLabel>
							<FormDescription>
								{t.home_page_redirect_to_description}
							</FormDescription>
							<FormControl>
								<LinkSelect
									homePageRedirectType={homePageRedirectType}
									isPending={isPending}
									redirectToBookId={redirectToBookId}
									redirectToDocId={redirectToDocId}
									onChange={(value) => {
										form.setValue(
											'homePageRedirectType',
											value.homePageRedirectType,
											{
												shouldDirty: true
											}
										);
										form.setValue('redirectToBookId', value.redirectToBookId, {
											shouldDirty: true
										});
										form.setValue('redirectToDocId', value.redirectToDocId, {
											shouldDirty: true
										});
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<SubmitButton
					className="w-auto"
					disabled={!form.formState.isDirty}
					isPending={isPending}
				>
					{t.update}
				</SubmitButton>
			</form>
		</Form>
	);
}

interface LinkSelectProps extends HomePageRedirectFormValues {
	isPending: boolean;
	onChange: (value: HomePageRedirectFormValues) => void;
}

function LinkSelect({
	homePageRedirectType,
	redirectToBookId,
	redirectToDocId,
	isPending,
	onChange
}: LinkSelectProps) {
	const [open, setOpen] = useState(false);
	const [redirectType, setRedirectType] = useState(homePageRedirectType);
	const [value, setValue] = useState(
		homePageRedirectType === 'BOOK'
			? JSON.stringify({ type: 'BOOK', id: redirectToBookId })
			: homePageRedirectType === 'DOC'
				? JSON.stringify({ type: 'DOC', id: redirectToDocId })
				: ''
	);

	const { data: books, isLoading: isLoadingBooks } = useGetBooks();
	const { data: docs, isLoading: isLoadingDocs } = useGetAllDocsMeta();
	const isLoading = isLoadingBooks || isLoadingDocs;

	return (
		<Popover modal open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					aria-expanded={open}
					className="w-[200px] justify-between"
					disabled={isLoading || isPending}
					role="combobox"
					variant="outline"
				>
					{value
						? redirectType === 'BOOK'
							? books?.find(
									(book) =>
										JSON.stringify({ type: 'BOOK', id: book.id }) === value
								)?.name
							: docs?.find(
									(doc) => JSON.stringify({ type: 'DOC', id: doc.id }) === value
								)?.title
						: t.default_no_redirect}
					<ChevronDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput className="h-9" placeholder={t.search_placeholder} />
					<CommandList>
						<CommandEmpty>{t.no_related_content_found}</CommandEmpty>
						<CommandGroup heading={t.books}>
							{books?.map((book) => (
								<CommandItem
									key={book.id}
									keywords={[book.name]}
									value={JSON.stringify({ type: 'BOOK', id: book.id })}
									onSelect={(currentValue) => {
										const isEqual = currentValue === value;

										setRedirectType(isEqual ? 'NONE' : 'BOOK');
										setValue(isEqual ? '' : currentValue);
										onChange(
											isEqual
												? {
														homePageRedirectType: 'NONE',
														redirectToBookId: null,
														redirectToDocId: null
													}
												: {
														homePageRedirectType: 'BOOK',
														redirectToBookId: book.id,
														redirectToDocId: null
													}
										);
										setOpen(false);
									}}
								>
									{book.name}
									<Check
										className={cn(
											'ml-auto',
											value === JSON.stringify({ type: 'BOOK', id: book.id })
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>

						<CommandGroup heading={t.docs}>
							{docs?.map((doc) => (
								<CommandItem
									key={doc.id}
									keywords={[doc.title]}
									value={JSON.stringify({ type: 'DOC', id: doc.id })}
									onSelect={(currentValue) => {
										const isEqual = currentValue === value;

										setRedirectType(isEqual ? 'NONE' : 'DOC');
										setValue(isEqual ? '' : currentValue);
										onChange(
											isEqual
												? {
														homePageRedirectType: 'NONE',
														redirectToBookId: null,
														redirectToDocId: null
													}
												: {
														homePageRedirectType: 'DOC',
														redirectToBookId: null,
														redirectToDocId: doc.id
													}
										);
										setOpen(false);
									}}
								>
									{doc.title}
									<Check
										className={cn(
											'ml-auto',
											value === JSON.stringify({ type: 'DOC', id: doc.id })
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
