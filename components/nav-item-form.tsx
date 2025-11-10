'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookEntity, TreeNodeEntity, TreeNodeType } from '@prisma/client';
import { Check, ChevronDown, Info } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createNavItem, updateNavItem } from '@/actions/tree-node';
import { SubmitButton } from '@/components/submit-button';
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
import { mutateTree, NAVBAR_MAP } from '@/stores/tree';
import { Nullable } from '@/types/common';
import { NavItemFormSchema, NavItemFormValues } from '@/types/tree-node';

import { useNavItemSheet } from './nav-item-sheet';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput
} from './ui/input-group';
import { Label } from './ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from './ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export interface NavItemFormProps {
	bookId: BookEntity['id'];
	parentTreeNodeId: TreeNodeEntity['parentId'];
	id: Nullable<TreeNodeEntity['id']>;
	defaultTitle?: TreeNodeEntity['title'];
	defaultType?: TreeNodeType;
	defaultUrl?: TreeNodeEntity['url'];
	defaultIsExternal?: TreeNodeEntity['isExternal'];
}

const t = getTranslations('components_nav_item_form');

export function NavItemForm({
	bookId,
	parentTreeNodeId,
	id,
	defaultTitle,
	defaultType,
	defaultUrl,
	defaultIsExternal
}: Readonly<NavItemFormProps>) {
	const [isPending, setIsPending] = useState(false);

	const setOpen = useNavItemSheet((state) => state.setOpen);

	useGetBooks();
	useGetAllDocsMeta();

	const form = useForm<NavItemFormValues>({
		resolver: zodResolver(NavItemFormSchema),
		mode: 'onChange',
		defaultValues: {
			title: defaultTitle ?? '',
			type: defaultType ?? 'GROUP',
			url: defaultUrl ?? '',
			isExternal: defaultIsExternal ?? false
		}
	});

	const onSubmit = async (values: NavItemFormValues) => {
		setIsPending(true);
		const promise = (async () => {
			const result = id
				? await updateNavItem({
						id,
						type: values.type,
						title: values.title,
						url: values.url ?? null,
						isExternal: values.isExternal ?? false
					})
				: await createNavItem({
						parentId: parentTreeNodeId,
						type: values.type,
						bookId,
						title: values.title,
						url: values.url ?? null,
						isExternal: values.isExternal ?? false
					});

			if (!result.success) {
				throw new Error(result.message);
			}

			if (!id) {
				setOpen(false);
			}

			mutateTree(bookId, NAVBAR_MAP);
		})();

		toast
			.promise(promise, {
				loading: id ? t.update_loading : t.add_loading,
				success: id ? t.update_success : t.add_success,
				error: id ? t.update_error : t.add_error
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
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.title}</FormLabel>
							<Input {...field} disabled={isPending} />
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
							<Select
								disabled={isPending}
								name={field.name}
								value={field.value}
								onValueChange={(value) => {
									field.onChange(value);
									form.setValue('url', '');
									form.setValue('isExternal', false);
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="GROUP">{t.group}</SelectItem>
									<SelectItem value="LINK">{t.link}</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{form.watch('type') === 'LINK' && (
					<FormField
						control={form.control}
						name="url"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t.url}
									<Tooltip>
										<TooltipTrigger asChild>
											<Info className="size-4" />
										</TooltipTrigger>
										<TooltipContent>
											<p>{t.example}</p>
										</TooltipContent>
									</Tooltip>
								</FormLabel>
								<LinkSelect
									isPending={isPending}
									url={field.value ?? ''}
									onChange={field.onChange}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{form.watch('type') === 'LINK' && (
					<FormField
						control={form.control}
						name="isExternal"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center gap-2">
									<Checkbox
										checked={field.value}
										disabled={isPending}
										id="isExternal"
										onCheckedChange={field.onChange}
									/>
									<Label htmlFor="isExternal">{t.open_in_new_tab}</Label>
								</div>
							</FormItem>
						)}
					/>
				)}

				<SubmitButton
					className="w-auto"
					disabled={isPending}
					isPending={isPending}
				>
					{id ? t.update : t.add}
				</SubmitButton>
			</form>
		</Form>
	);
}

interface LinkSelectProps {
	url: string;
	onChange: (value: string) => void;
	isPending: boolean;
}

function LinkSelect({ url, onChange, isPending }: LinkSelectProps) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(url);

	const { data: books, isLoading: isLoadingBooks } = useGetBooks();
	const { data: docs, isLoading: isLoadingDocs } = useGetAllDocsMeta();
	const isLoading = isLoadingBooks || isLoadingDocs;

	const title =
		books?.find((book) => `/${book.slug}` === value)?.name ??
		docs?.find((doc) => `/${doc.book.slug}/${doc.slug}` === value)?.title;

	return (
		<InputGroup>
			<InputGroupInput
				disabled={isPending}
				value={value}
				onChange={(e) => {
					onChange(e.target.value);
					setValue(e.target.value);
				}}
			/>
			<InputGroupAddon align="inline-end">
				<Popover modal open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<InputGroupButton
							className="!pr-1.5 text-xs"
							disabled={isLoading || isPending}
							variant="ghost"
						>
							<span className="inline-block max-w-32 truncate">
								{title ? title : t.search_in}
							</span>
							<ChevronDown className="size-3" />
						</InputGroupButton>
					</PopoverTrigger>
					<PopoverContent
						align="end"
						className="w-[200px] p-0"
						onCloseAutoFocus={(e) => e.preventDefault()}
					>
						<Command>
							<CommandInput className="h-9" />
							<CommandList>
								<CommandEmpty>{t.no_related_content_found}</CommandEmpty>
								<CommandGroup heading={t.books}>
									{books?.map((book) => (
										<CommandItem
											key={book.id}
											keywords={[book.name]}
											value={book.slug}
											onSelect={(currentValue) => {
												const isEqual = value === `/${currentValue}`;
												const newValue = isEqual ? '' : `/${currentValue}`;

												setValue(newValue);
												onChange(newValue);
												setOpen(false);
											}}
										>
											{book.name}
											<Check
												className={cn(
													'ml-auto',
													value === `/${book.slug}`
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
											value={doc.slug}
											onSelect={() => {
												const isEqual =
													value === `/${doc.book.slug}/${doc.slug}`;
												const newValue = isEqual
													? ''
													: `/${doc.book.slug}/${doc.slug}`;

												setValue(newValue);
												onChange(newValue);
												setOpen(false);
											}}
										>
											{doc.title}
											<Check
												className={cn(
													'ml-auto',
													value === `/${doc.book.slug}/${doc.slug}`
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
			</InputGroupAddon>
		</InputGroup>
	);
}
