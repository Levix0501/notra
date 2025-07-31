import { LoginForm } from '@/components/login-form';
import NotraFooter from '@/components/notra-footer';
import NotraHeader from '@/components/notra-header';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';

export default function Page() {
	return (
		<div className="flex min-h-dvh flex-col">
			<NotraHeader />

			<main className="flex flex-1 items-center justify-center">
				<Card className="w-sm">
					<CardHeader>
						<CardTitle>Login</CardTitle>
						<CardDescription>
							Enter your username and password to login
						</CardDescription>
					</CardHeader>
					<CardContent>
						<LoginForm />
					</CardContent>
				</Card>
			</main>

			<NotraFooter />
		</div>
	);
}
