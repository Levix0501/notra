import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { DocMetaVo } from '@/types/doc';

dayjs.extend(relativeTime);

interface DocCardProps {
	doc: DocMetaVo;
}

export default function DocCard({ doc }: Readonly<DocCardProps>) {
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

				<div className="flex items-center gap-3 text-sm text-muted-foreground">
					<dl>
						<dt className="sr-only">Published on</dt>
						<dd>
							<time dateTime={dayjs(doc.publishedAt).toISOString()}>
								{dayjs(doc.publishedAt).fromNow()}
							</time>
						</dd>
					</dl>

					<div className="flex items-center gap-0.5">
						<Eye size={16} />
						<span>{doc.viewCount}</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
