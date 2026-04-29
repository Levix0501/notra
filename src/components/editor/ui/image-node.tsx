import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import Image from 'next/image';

import { isAllowedDomain } from '@/lib/image';

export const ImageNode = (props: NodeViewProps) => {
	const src = props.node.attrs.src;

	return (
		<NodeViewWrapper>
			<div className="flex items-center justify-center">
				{isAllowedDomain(src) ? (
					<Image
						alt={props.node.attrs.alt}
						height={props.node.attrs.height}
						sizes="100%"
						src={props.node.attrs.src}
						width={props.node.attrs.width}
					/>
				) : (
					<picture>
						<img
							alt={props.node.attrs.alt}
							height={props.node.attrs.height ?? void 0}
							src={props.node.attrs.src}
							width={props.node.attrs.width ?? void 0}
						/>
					</picture>
				)}
			</div>
		</NodeViewWrapper>
	);
};
