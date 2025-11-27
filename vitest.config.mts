import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'happy-dom',
		setupFiles: ['./tests/setup.ts'],
		globals: true
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './')
		}
	}
});
