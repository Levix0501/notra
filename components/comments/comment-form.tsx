'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreateCommentSchema } from '@/src/lib/validations/comment';

const CommentFormSchema = CreateCommentSchema.pick({
	content: true,
	authorName: true,
	authorEmail: true,
	authorWebsite: true,
	honeypot: true
});

type CommentFormValues = z.infer<typeof CommentFormSchema>;

type CommentFormProps = {
	submitText?: string;
	onSubmit: (values: CommentFormValues) => Promise<void>;
};

export function CommentForm({
	onSubmit,
	submitText = 'Post comment'
}: CommentFormProps) {
	const [isPending, setIsPending] = useState(false);
	const form = useForm<CommentFormValues>({
		resolver: zodResolver(CommentFormSchema),
		defaultValues: {
			content: '',
			authorName: '',
			authorEmail: '',
			authorWebsite: '',
			honeypot: ''
		}
	});

	const handleSubmit = async (values: CommentFormValues) => {
		setIsPending(true);

		try {
			await onSubmit(values);
			form.reset();
		} finally {
			setIsPending(false);
		}
	};

	return (
		<Form {...form}>
			<form className="space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
				<div className="grid gap-3 md:grid-cols-2">
					<FormField
						control={form.control}
						name="authorName"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Your name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="authorEmail"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="your@email.com" type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="authorWebsite"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="Website (optional)" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea
									placeholder="Write your comment..."
									rows={4}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="honeypot"
					render={({ field }) => (
						<FormItem className="hidden">
							<FormControl>
								<Input
									autoComplete="off"
									tabIndex={-1}
									{...field}
									value={field.value ?? ''}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button disabled={isPending} type="submit">
					{submitText}
				</Button>
			</form>
		</Form>
	);
}
