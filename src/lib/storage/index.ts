import {
	ENV_MINIO_ENDPOINT,
	ENV_MINIO_ROOT_PASSWORD,
	ENV_MINIO_ROOT_USER,
	ENV_SUPABASE_API_KEY,
	ENV_SUPABASE_URL
} from '@/constants/env';

import MinioStorage from './minio';
import SupabaseStorage from './supabase';

export interface IStorage {
	upload(file: File, path: string): Promise<string>;
	delete(path: string): Promise<void>;
}

let storage: IStorage = {
	upload: async () => {
		throw new Error('Storage not initialized');
	},
	delete: async () => {
		throw new Error('Storage not initialized');
	}
};

if (ENV_SUPABASE_URL && ENV_SUPABASE_API_KEY) {
	storage = new SupabaseStorage();
} else if (
	ENV_MINIO_ENDPOINT &&
	ENV_MINIO_ROOT_USER &&
	ENV_MINIO_ROOT_PASSWORD
) {
	storage = new MinioStorage();
}

export default storage;
