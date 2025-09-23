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
import { getTranslations } from '@/i18n';
import {
	AnalyticsFormSchema,
	AnalyticsFormValues
} from '@/types/site-settings';

import { Input } from './ui/input';

export interface AnalyticsFormProps {
	defaultGaId: string;
	mutateSiteSettings: () => void;
}

const t = getTranslations('components_analytics_form');

export default function AnalyticsForm({
	defaultGaId,
	mutateSiteSettings
}: Readonly<AnalyticsFormProps>) {
	const [isPending, setIsPending] = useState(false);

	const form = useForm<AnalyticsFormValues>({
		resolver: zodResolver(AnalyticsFormSchema),
		defaultValues: {
			gaId: defaultGaId
		}
	});

	const onSubmit = async (values: AnalyticsFormValues) => {
		setIsPending(true);

		const promise = (async () => {
			const result = await updateSiteSettings({
				gaId: values.gaId
			});

			if (!result.success) {
				throw new Error(result.message);
			}

			form.reset({
				gaId: values.gaId
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
					name="gaId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.google_analytics_id}</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled={isPending}
									placeholder="G-1234567890"
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
					{t.update_analytics}
				</SubmitButton>
			</form>
		</Form>
	);
}
