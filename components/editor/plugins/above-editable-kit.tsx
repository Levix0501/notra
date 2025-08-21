import { createPlatePlugin } from 'platejs/react';

import { ChildrenProps } from '@/types/common';

export const AboveEditableKit = [
	createPlatePlugin({
		key: 'aboveEditable',
		render: {
			aboveEditable: ({ children }: ChildrenProps) => {
				return <div>{children}</div>;
			}
		}
	})
];
