import Image from 'next/image';
import { NodeApi, SlateElement } from 'platejs';

import { cn } from '@/lib/utils';

import type {
	SlateElementProps,
	TCaptionProps,
	TImageElement,
	TResizableProps
} from 'platejs';

export function ImageElementStatic(
	props: SlateElementProps<TImageElement & TCaptionProps & TResizableProps>
) {
	const {
		align = 'center',
		caption,
		url,
		width,
		initialHeight,
		initialWidth
	} = props.element;

	return (
		<SlateElement
			{...props}
			className={cn(
				'flex py-2.5',
				align === 'left' && 'justify-start',
				align === 'center' && 'justify-center',
				align === 'right' && 'justify-end'
			)}
		>
			<figure
				className="group relative m-0 inline-block"
				style={{
					width: width ?? '100%',
					maxWidth: initialWidth ? initialWidth / 2 : '100%'
				}}
			>
				<div
					className="relative w-full"
					style={{
						paddingBottom: `${((initialHeight ?? 0) / (initialWidth ?? 1)) * 100}%`
					}}
				>
					<Image
						fill
						alt={caption ? NodeApi.string(caption[0]) : ''}
						className={'cursor-default rounded-sm object-cover'}
						sizes="100vw"
						src={url}
						unoptimized={url.endsWith('.svg') || url.endsWith('.gif')}
					/>
				</div>

				{caption && (
					<figcaption className="mx-auto mt-2 h-[24px] max-w-full text-center">
						{NodeApi.string(caption[0])}
					</figcaption>
				)}
			</figure>
			{props.children}
		</SlateElement>
	);
}
