import { BookEntity, DocEntity, TreeNodeType } from '@prisma/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { getTranslations } from '@/i18n';
import { TreeNodeService } from '@/services/tree-node';

interface DocFooterNavProps {
	bookId: BookEntity['id'];
	bookSlug: BookEntity['slug'];
	docId: DocEntity['id'];
}

const t = getTranslations('components_doc_footer_nav');

export const DocFooterNav = async ({
	bookId,
	bookSlug,
	docId
}: DocFooterNavProps) => {
	const { data: treeNodes } =
		await TreeNodeService.getPublishedTreeNodesByBookId(bookId);
	const docNodes =
		treeNodes?.filter((node) => node.type === TreeNodeType.DOC) ?? [];
	const currentDocIndex = docNodes?.findIndex((node) => node.docId === docId);
	const prevDoc = currentDocIndex > 0 ? docNodes?.[currentDocIndex - 1] : null;
	const nextDoc =
		currentDocIndex < docNodes?.length - 1
			? docNodes?.[currentDocIndex + 1]
			: null;

	return (
		<nav
			aria-label="pagination"
			className="my-12 flex w-full justify-between border-t border-gray-200 pt-8 [&_a]:inline-block [&_a]:max-w-[48%]"
		>
			{prevDoc && (
				<Link className="group" href={`/${bookSlug}/${prevDoc.url}`}>
					<p className="text-xs leading-6 text-muted-foreground transition-colors group-hover:text-primary">
						<ChevronLeft
							className="-mt-0.5 inline-block align-middle"
							size={12}
						/>{' '}
						{t.previous}
					</p>
					<span className="text-base font-medium text-primary/90 transition-colors group-hover:text-primary">
						{prevDoc.title}
					</span>
				</Link>
			)}

			{nextDoc && (
				<Link
					className="group ml-auto text-right"
					href={`/${bookSlug}/${nextDoc.url}`}
				>
					<p className="text-xs leading-6 text-muted-foreground transition-colors group-hover:text-primary">
						{t.next}{' '}
						<ChevronRight
							className="-mt-0.5 inline-block align-middle"
							size={12}
						/>
					</p>
					<span className="text-base font-medium text-primary/90 transition-colors group-hover:text-primary">
						{nextDoc.title}
					</span>
				</Link>
			)}
		</nav>
	);
};
