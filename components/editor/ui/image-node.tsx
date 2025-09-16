import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import Image from 'next/image';

export const ImageNode = (props: NodeViewProps) => {
	return (
		<NodeViewWrapper>
			<div className="flex items-center justify-center">
				<Image
					alt={props.node.attrs.alt}
					height={props.node.attrs.height}
					src={props.node.attrs.src}
					width={props.node.attrs.width}
				/>
			</div>
		</NodeViewWrapper>
	);
};
