import Link from 'next/link';

import AccountDropdown from '@/components/account-dropdown';

export default function Page() {
	return (
		<main className="container mx-auto">
			<h1>Dashboard</h1>
			<Link href="/">Home</Link>

			<AccountDropdown />
		</main>
	);
}
