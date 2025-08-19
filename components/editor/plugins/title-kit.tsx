import { createPlatePlugin } from 'platejs/react';

import TitleTextarea from '../ui/title-textarea';

export const TitleKit = [
	createPlatePlugin({
		key: 'title',
		render: {
			beforeEditable: () => {
				return <TitleTextarea />;
			}
		}
	})
];
