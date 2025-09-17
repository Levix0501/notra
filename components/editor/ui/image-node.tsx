import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import Image from 'next/image';

export const ImageNode = (props: NodeViewProps) => {
	const dataSource = props.node.attrs['data-source'];

	return (
		<NodeViewWrapper>
			<div className="flex items-center justify-center">
				{dataSource === 'upload' ? (
					<Image
						alt={props.node.attrs.alt}
						height={props.node.attrs.height}
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
