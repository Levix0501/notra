import { NextResponse } from 'next/server';

// Avoid shipping a binary .ico in the repo. Browsers request /favicon.ico by default,
// so redirect it to an existing public asset.
export function GET() {
	const base = (process.env.AUTH_URL ?? 'https://localhost').replace(/\/$/, '');

	return NextResponse.redirect(new URL('/logo.svg', base), 307);
}
