import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Eye } from 'lucide-react';
import { ReactNode } from 'react';

dayjs.extend(relativeTime);

interface DocMetaProps {
	publishedAt: Date;
	children: ReactNode;
}

export const DocMeta = ({ publishedAt, children }: Readonly<DocMetaProps>) => {
	return (
		<div className="flex items-center gap-3 text-sm text-muted-foreground">
			<dl>
				<dt className="sr-only">Published on</dt>
				<dd>
					<time dateTime={dayjs(publishedAt).toISOString()}>
						{dayjs(publishedAt).fromNow()}
					</time>
				</dd>
			</dl>

			<div className="flex items-center gap-0.5">
				<Eye size={16} />
				{children}
			</div>
		</div>
	);
};
