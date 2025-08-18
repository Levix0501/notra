import { createPlatePlugin } from 'platejs/react';

export const TitleKit = [
	createPlatePlugin({
		key: 'title',
		render: {
			// beforeEditable: () => {
			// 	return <TitleTextarea />;
			// }
		}
	})
];
