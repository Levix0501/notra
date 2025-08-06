'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { create } from 'zustand';

import { createBook } from '@/actions/book';
import { SubmitButton } from '@/components/submit-button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getTranslations } from '@/i18n';
import { useGetBooks } from '@/queries/book';
import { CreateBookFormValues, CreateBookFormSchema } from '@/types/book';

type CreateBookDialogStore = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export const useCreateBookDialog = create<CreateBookDialogStore>((set) => ({
	open: false,
	setOpen: (open) => set({ open })
}));

const t = getTranslations('components_create_book_dialog');

export function CreateBookDialog() {
	const [isPending, setIsPending] = useState(false);

	const open = useCreateBookDialog((state) => state.open);
	const setOpen = useCreateBookDialog((state) => state.setOpen);
	const router = useRouter();
	const { mutate } = useGetBooks();

	const form = useForm<CreateBookFormValues>({
		resolver: zodResolver(CreateBookFormSchema),
		defaultValues: {
			name: ''
		}
	});

	const onSubmit = async (values: CreateBookFormValues) => {
		setIsPending(true);

		const promise = (async () => {
			const result = await createBook(values);

			if (!result.success) {
				throw new Error(result.message);
			}

			return result.data;
		})();

		toast
			.promise(promise, {
				loading: t.create_loading,
				success: t.create_success,
				error: t.create_error
			})
			.unwrap()
			.then((data) => {
				router.push(`/dashboard/${data?.slug}`);
				mutate();
				setOpen(false);
				form.reset();
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setIsPending(false);
			});
	};

	const isDisabled = form.watch('name') === '';

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className="sm:max-w-md"
				onCloseAutoFocus={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>{t.new_book}</DialogTitle>
					<VisuallyHidden asChild>
						<DialogDescription>{t.new_book}</DialogDescription>
					</VisuallyHidden>
				</DialogHeader>

				<div className="mt-4">
					<Form {...form}>
						<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												className="h-10"
												disabled={isPending}
												placeholder={t.name_placeholder}
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<SubmitButton
								className="h-10"
								disabled={isDisabled}
								isPending={isPending}
							>
								{t.create}
							</SubmitButton>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
