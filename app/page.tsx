import Link from 'next/link';

import NotraFooter from '@/components/notra-footer';
import NotraHeader from '@/components/notra-header';

export default function Page() {
	return (
		<div className="flex min-h-dvh flex-col">
			<NotraHeader />

			<main className="container mx-auto flex-1">
				<h1>Home</h1>
				<Link href="/dashboard">Dashboard</Link>
			</main>

			<NotraFooter />
		</div>
	);
}
