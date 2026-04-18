'use client';

import { ImageIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

type PublicStorageImgProps = {
	src: string;
	alt: string;
	/** Wrapper (layout, aspect ratio, overflow). */
	className?: string;
	/** Classes on the `img` (e.g. rounded, object-fit). */
	imgClassName?: string;
};

export function PublicStorageImg({
	src,
	alt,
	className,
	imgClassName
}: Readonly<PublicStorageImgProps>) {
	const [failed, setFailed] = useState(false);

	if (!src || failed) {
		return (
			<div
				className={cn(
					'flex items-center justify-center bg-muted text-muted-foreground',
					className
				)}
			>
				<ImageIcon aria-hidden className="size-10 shrink-0 sm:size-12" />
			</div>
		);
	}

	return (
		<div className={cn('relative overflow-hidden', className)}>
			<img
				alt={alt}
				className={cn('size-full object-cover', imgClassName)}
				src={src}
				onError={() => setFailed(true)}
			/>
		</div>
	);
}
