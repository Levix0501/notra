import { SlateElement } from 'platejs';

import type { SlateElementProps, TAudioElement } from 'platejs';

export function AudioElementStatic(props: SlateElementProps<TAudioElement>) {
	return (
		<SlateElement {...props} className="mb-1">
			<figure className="group relative cursor-default">
				<div className="h-16">
					<audio controls className="size-full" src={props.element.url} />
				</div>
			</figure>
			{props.children}
		</SlateElement>
	);
}
