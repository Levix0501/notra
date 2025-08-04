import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { ENV_SUPABASE_API_KEY, ENV_SUPABASE_URL } from '@/constants/env';
import { logger } from '@/lib/logger';

import { IStorage } from '.';

export default class SupabaseStorage implements IStorage {
	private readonly supabase: SupabaseClient;
	private readonly BUCKET_NAME = 'notra';

	constructor() {
		this.supabase = createClient(ENV_SUPABASE_URL!, ENV_SUPABASE_API_KEY!);
	}

	private async createBucket() {
		try {
			const { data: bucket } = await this.supabase.storage.getBucket(
				this.BUCKET_NAME
			);

			if (!bucket) {
				await this.supabase.storage.createBucket(this.BUCKET_NAME, {
					public: true
				});
			}
		} catch (error) {
			logger('SupabaseStorage.createBucket', error);
		}
	}

	async upload(file: File, path: string): Promise<string> {
		await this.createBucket();

		const { data, error } = await this.supabase.storage
			.from(this.BUCKET_NAME)
			.upload(path, file);

		if (error) {
			throw error;
		}

		const {
			data: { publicUrl }
		} = this.supabase.storage.from(this.BUCKET_NAME).getPublicUrl(data.path);

		return publicUrl;
	}

	async delete(path: string): Promise<void> {
		const { error } = await this.supabase.storage
			.from(this.BUCKET_NAME)
			.remove([path]);

		if (error) {
			throw error;
		}
	}
}
