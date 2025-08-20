import { zodResolver } from '@hookform/resolvers/zod';
import { useImperativeHandle } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

import { getTranslations } from '@/i18n';
import { IndexPageFormSchema, IndexPageFormValues } from '@/types/index-page';

import IndexPageDocView from './index-page-doc-view';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from './ui/card';
import { Checkbox } from './ui/checkbox';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export type IndexPageDocFormHandle = {
	form: UseFormReturn<IndexPageFormValues>;
};

export interface IndexPageDocFormProps {
	ref: React.RefObject<IndexPageDocFormHandle | null>;
	defaultValues: IndexPageFormValues;
}

const t = getTranslations('components_index_page_doc_form');

export default function IndexPageDocForm({
	ref,
	defaultValues
}: Readonly<IndexPageDocFormProps>) {
	const form = useForm<IndexPageFormValues>({
		resolver: zodResolver(IndexPageFormSchema),
		defaultValues
	});

	useImperativeHandle(ref, () => ({
		form
	}));

	const onSubmit = async () => {};

	return (
		<div className="flex flex-col gap-6 xl:flex-row">
			<Card className="xl:flex-1">
				<CardHeader>
					<CardTitle>{t.form}</CardTitle>
					<CardDescription></CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							className="mx-auto max-w-screen-sm space-y-6"
							onChange={form.handleSubmit(onSubmit)}
						>
							<FormField
								control={form.control}
								name="indexTitle"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t.index_title}</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="indexDescription"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t.index_description}</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="mainActionText"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t.main_action_text}</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="mainActionUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t.main_action_url}</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isMainNewTab"
								render={({ field }) => (
									<FormItem className="flex items-center gap-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel>{t.is_main_new_tab}</FormLabel>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="subActionText"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t.sub_action_text}</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="subActionUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t.sub_action_url}</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isSubNewTab"
								render={({ field }) => (
									<FormItem className="flex items-center gap-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel>{t.is_sub_new_tab}</FormLabel>
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</CardContent>
			</Card>

			<Card className="xl:flex-1">
				<CardHeader>
					<CardTitle>{t.preview}</CardTitle>
					<CardDescription></CardDescription>
				</CardHeader>
				<CardContent>
					<div className="pb-12 md:pb-36">
						<IndexPageDocView
							indexDescription={form.watch().indexDescription ?? ''}
							indexTitle={form.watch().indexTitle ?? ''}
							isMainNewTab={form.watch().isMainNewTab}
							isSubNewTab={form.watch().isSubNewTab}
							mainActionText={form.watch().mainActionText ?? ''}
							mainActionUrl={form.watch().mainActionUrl ?? ''}
							subActionText={form.watch().subActionText ?? ''}
							subActionUrl={form.watch().subActionUrl ?? ''}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
