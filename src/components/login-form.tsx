'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { login } from '@/actions/auth';
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
import { getTranslations } from '@/i18n';
import { LoginFormValues, LoginFormSchema } from '@/types/auth';

const t = getTranslations('components_login_form');

export function LoginForm() {
	const [isPending, setIsPending] = useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			username: '',
			password: ''
		}
	});
	const router = useRouter();
	const { update } = useSession();

	const onSubmit = (values: LoginFormValues) => {
		setIsPending(true);
		login(values)
			.then((result) => {
				if (result.success) {
					router.refresh();
					update();
				} else {
					toast.error(result.message);
				}
			})
			.catch(() => {
				toast.error(t.login_error);
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
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.username_label}</FormLabel>
							<FormControl>
								<Input disabled={isPending} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.password_label}</FormLabel>
							<FormControl>
								<Input disabled={isPending} type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<SubmitButton isPending={isPending}>{t.login_button}</SubmitButton>
			</form>
		</Form>
	);
}
