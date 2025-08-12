import DocStoreProvider from '@/components/doc-store-provider';
import HeaderEditableTitle from '@/components/header-editable-title';
import { NotraInsetHeader } from '@/components/notra-sidebar';

interface PageProps {
	params: Promise<{
		doc: string;
	}>;
}

export default async function Page({ params }: Readonly<PageProps>) {
	const { doc: slug } = await params;

	return (
		<>
			<NotraInsetHeader>
				<div className="flex size-full items-center justify-between">
					<HeaderEditableTitle />
				</div>
			</NotraInsetHeader>

			<main className="container mx-auto p-4 md:p-8">doc page</main>

			<DocStoreProvider slug={slug} />
		</>
	);
}
