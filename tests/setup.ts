import 'fake-indexeddb/auto';
import { afterEach } from 'vitest';

import { closeDatabase } from '@/services/demo';

// Clean up databases after each test
afterEach(async () => {
	// Close the DemoService database connection first
	await closeDatabase();

	// Get all databases and delete them
	const databases = await indexedDB.databases();

	// Delete each database and wait for completion
	await Promise.all(
		databases.map(
			(dbInfo) =>
				new Promise<void>((resolve, reject) => {
					if (dbInfo.name) {
						const request = indexedDB.deleteDatabase(dbInfo.name);

						request.onsuccess = () => resolve();
						request.onerror = () => reject(request.error);

						request.onblocked = () => {
							// If blocked, resolve after a short delay
							setTimeout(() => resolve(), 100);
						};
					} else {
						resolve();
					}
				})
		)
	);
});
