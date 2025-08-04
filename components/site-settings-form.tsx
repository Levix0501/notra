'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FileEntity } from '@prisma/client';
import { Upload } from 'lucide-react';
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
import { processError, uploadFile } from '@/lib/utils';
import {
	SiteSettingsFormSchema,
	SiteSettingsFormValues
} from '@/types/site-settings';

import { ImageCropper } from './image-cropper';

export interface SiteSettingsFormProps {
	defaultTitle: string;
	defaultDescription: string;
	defaultLogo: string;
	defaultDarkLogo: string;
	mutateSiteSettings: () => void;
}

const t = getTranslations('components_site_settings_form');

export default function SiteSettingsForm({
	defaultTitle,
	defaultDescription,
	defaultLogo,
	defaultDarkLogo,
	mutateSiteSettings
}: Readonly<SiteSettingsFormProps>) {
	const [isPending, setIsPending] = useState(false);

	const form = useForm<SiteSettingsFormValues>({
		resolver: zodResolver(SiteSettingsFormSchema),
		defaultValues: {
			title: defaultTitle,
			description: defaultDescription,
			logo: void 0,
			darkLogo: void 0
		}
	});

	const onSubmit = async (values: SiteSettingsFormValues) => {
		setIsPending(true);

		let image: FileEntity | undefined;

		if (values.logo) {
			try {
				image = await uploadFile(values.logo);
			} catch (error) {
				processError(error, () => {
					toast.error(t.upload_error);
				});
				setIsPending(false);

				return;
			}
		}

		let darkImage: FileEntity | undefined;

		if (values.darkLogo) {
			try {
				darkImage = await uploadFile(values.darkLogo);
			} catch (error) {
				processError(error, () => {
					toast.error(t.upload_error);
				});
				setIsPending(false);

				return;
			}
		}

		try {
			const result = await updateSiteSettings({
				title: values.title,
				description: values.description,
				logo: values.logo === null ? null : image?.url,
				darkLogo: values.darkLogo === null ? null : darkImage?.url
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

	const logoPlaceholder = (
		<div className="flex items-center justify-center">
			<Upload className="h-5 w-5 text-muted-foreground" />
		</div>
	);

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

				<FormField
					control={form.control}
					name="logo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.logo}</FormLabel>
							<div className="w-28">
								<ImageCropper
									aspectRatio={1}
									defaultImage={defaultLogo}
									disabled={isPending}
									placeholder={logoPlaceholder}
									title={t.edit_logo}
									onCrop={(croppedFile) => {
										field.onChange(croppedFile);
									}}
								/>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="darkLogo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.dark_logo}</FormLabel>
							<div className="w-28">
								<ImageCropper
									aspectRatio={1}
									defaultImage={defaultDarkLogo}
									disabled={isPending}
									placeholder={logoPlaceholder}
									title={t.edit_dark_logo}
									onCrop={(croppedFile) => {
										field.onChange(croppedFile);
									}}
								/>
							</div>
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
