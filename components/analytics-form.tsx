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
import { processError } from '@/lib/utils';
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
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<AnalyticsFormValues>({
		resolver: zodResolver(AnalyticsFormSchema),
		defaultValues: {
			gaId: defaultGaId
		}
	});

	const onSubmit = async (values: AnalyticsFormValues) => {
		setIsLoading(true);

		try {
			const result = await updateSiteSettings({
				gaId: values.gaId
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
		}

		setIsLoading(false);
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
									disabled={isLoading}
									placeholder="G-1234567890"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<SubmitButton className="w-auto" isPending={isLoading}>
					{t.update_analytics}
				</SubmitButton>
			</form>
		</Form>
	);
}
