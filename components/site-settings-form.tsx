'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateSiteSettings } from '@/actions/site-settings';
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
import { Textarea } from '@/components/ui/textarea';
import { getTranslations } from '@/i18n';
import { processError } from '@/lib/utils';
import {
	SiteSettingsFormSchema,
	SiteSettingsFormValues
} from '@/types/site-settings';

export interface SiteSettingsFormProps {
	defaultTitle: string;
	defaultDescription: string;
	mutateSiteSettings: () => void;
}

const t = getTranslations('components_site_settings_form');

export default function SiteSettingsForm({
	defaultTitle,
	defaultDescription,
	mutateSiteSettings
}: SiteSettingsFormProps) {
	const [isPending, setIsPending] = useState(false);

	const form = useForm<SiteSettingsFormValues>({
		resolver: zodResolver(SiteSettingsFormSchema),
		defaultValues: {
			title: defaultTitle,
			description: defaultDescription
		}
	});

	const onSubmit = async (values: SiteSettingsFormValues) => {
		setIsPending(true);

		try {
			const result = await updateSiteSettings({
				title: values.title,
				description: values.description
			});

			if (result.success) {
				mutateSiteSettings();
				toast.success(t.update_success);
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			processError(error, () => {
				toast.error(t.update_error);
			});
		} finally {
			setIsPending(false);
		}
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
							<FormControl>
								<Input {...field} disabled={isPending} placeholder="Notra" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.description}</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									disabled={isPending}
									placeholder={t.description_placeholder}
									value={field.value ?? ''}
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
