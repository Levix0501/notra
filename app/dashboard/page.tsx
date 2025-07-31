'use client';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';

export default function Page() {
	return (
		<main className="container mx-auto">
			<h1>Dashboard</h1>
			<Link href="/">Home</Link>

			<Button onClick={() => signOut()}>Logout</Button>
		</main>
	);
}
