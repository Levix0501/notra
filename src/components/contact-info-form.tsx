'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookEntity, TreeNodeEntity } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createContactInfo, updateContactInfo } from '@/actions/tree-node';
import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import {
	Form,
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
import { CONTACT_INFO_ICONS } from '@/constants/contact';
import { getTranslations } from '@/i18n';
import { useGetSiteSettings } from '@/queries/site-settings';
import { CONTACT_INFO_MAP, mutateTree } from '@/stores/tree';
import { Nullable } from '@/types/common';
import {
	ContactInfoFormSchema,
	ContactInfoFormValues
} from '@/types/tree-node';

import { ContactInfoIcon } from './contact-info-icon';
import { useContactInfoSheet } from './contact-info-sheet';
import { Input } from './ui/input';

export interface ContactInfoFormProps {
	bookId: BookEntity['id'];
	id: Nullable<TreeNodeEntity['id']>;
	defaultUrl?: TreeNodeEntity['url'];
	defaultIcon?: TreeNodeEntity['icon'];
}

const t = getTranslations('components_contact_info_form');

export function ContactInfoForm({
	bookId,
	id,
	defaultUrl,
	defaultIcon
}: Readonly<ContactInfoFormProps>) {
	const [isPending, setIsPending] = useState(false);

	const setOpen = useContactInfoSheet((state) => state.setOpen);

	const form = useForm<ContactInfoFormValues>({
		resolver: zodResolver(ContactInfoFormSchema),
		mode: 'onChange',
		defaultValues: {
			icon: defaultIcon ?? CONTACT_INFO_ICONS[0].slug,
			url: defaultUrl ?? ''
		}
	});

	const onSubmit = async (values: ContactInfoFormValues) => {
		setIsPending(true);
		const promise = (async () => {
			const result = id
				? await updateContactInfo({
						id,
						icon: values.icon,
						url: values.url
					})
				: await createContactInfo({
						bookId,
						icon: values.icon,
						url: values.url.trim()
					});

			if (!result.success) {
				throw new Error(result.message);
			}

			if (!id) {
				setOpen(false);
			}

			mutateTree(bookId, CONTACT_INFO_MAP, false);
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
					name="icon"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.icon}</FormLabel>
							<IconSelect
								isPending={isPending}
								value={field.value}
								onChange={field.onChange}
							/>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.content}</FormLabel>
							<Input {...field} disabled={isPending} />
							<FormMessage />
							<FormDescription className="text-xs">
								{t.content_description}
							</FormDescription>
						</FormItem>
					)}
				/>

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

interface IconSelectProps {
	value: string;
	onChange: (value: string) => void;
	isPending: boolean;
}

function IconSelect({ value, onChange, isPending }: IconSelectProps) {
	const [open, setOpen] = useState(false);

	const { data: siteSettings } = useGetSiteSettings();

	const icon = CONTACT_INFO_ICONS.find((icon) => icon.slug === value);

	return (
		<Popover modal open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					aria-expanded={open}
					className="size-9 p-0"
					disabled={isPending}
					role="combobox"
					variant="outline"
				>
					{icon ? (
						<ContactInfoIcon
							colored={siteSettings?.coloredContactIcons ?? false}
							darkInvert={icon.darkInvert ?? false}
							hex={icon.hex}
							svg={icon.svg}
						/>
					) : (
						<Plus />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-[170px] p-0"
				onCloseAutoFocus={(e) => e.preventDefault()}
			>
				<div className="flex flex-wrap gap-2 p-2">
					{CONTACT_INFO_ICONS.map(({ slug, svg, hex, darkInvert }) => (
						<div
							key={slug}
							className="cursor-pointer rounded-sm p-1.5 hover:bg-accent"
							onClick={() => {
								onChange(slug);
								setOpen(false);
							}}
						>
							<ContactInfoIcon
								colored={siteSettings?.coloredContactIcons ?? false}
								darkInvert={darkInvert ?? false}
								hex={hex}
								svg={svg}
							/>
						</div>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
