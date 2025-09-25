import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { ChildrenProps } from '@/types/common';
import { DocMetaVo } from '@/types/doc';

import { DocMeta } from './doc-meta';

interface DocCardProps extends ChildrenProps {
	doc: DocMetaVo;
}

export default function DocCard({ doc, children }: Readonly<DocCardProps>) {
	return (
		<Link
			className="group overflow-hidden rounded-xl border"
			href={`/${doc.book.slug}/${doc.slug}`}
		>
			<div className="relative aspect-video overflow-hidden border-b">
				{doc.cover ? (
					<Image
						fill
						alt={doc.title}
						className="sm:transition-transform sm:ease-in-out sm:group-hover:scale-105"
						sizes="(max-width:639px) 100vw, (max-width:767px) 50vw, 33vw"
						src={doc.cover}
					/>
				) : (
					<div className="flex size-full items-center justify-center p-3 text-center text-xl font-extrabold break-all sm:transition-transform sm:ease-in-out sm:group-hover:scale-105">
						{doc.title}
					</div>
				)}
			</div>

			<div className="space-y-2 p-4.5">
				{doc.cover && (
					<div className="line-clamp-2 text-xl font-semibold break-all">
						{doc.title}
					</div>
				)}
				<div
					className={cn(
						'text-sm break-all',
						doc.cover ? 'line-clamp-3' : 'line-clamp-2'
					)}
				>
					{doc.summary}
				</div>

				<DocMeta publishedAt={doc.publishedAt}>{children}</DocMeta>
			</div>
		</Link>
	);
}
