import { Client } from 'minio';

import {
	ENV_MINIO_ENDPOINT,
	ENV_MINIO_ROOT_PASSWORD,
	ENV_MINIO_ROOT_USER
} from '@/constants/env';
import { logger } from '@/lib/logger';

import { IStorage } from '.';

export default class MinioStorage implements IStorage {
	private readonly minioClient: Client;
	private readonly BUCKET_NAME = 'notra';

	constructor() {
		if (
			!ENV_MINIO_ENDPOINT ||
			!ENV_MINIO_ROOT_USER ||
			!ENV_MINIO_ROOT_PASSWORD
		) {
			throw new Error('Minio credentials are not set');
		}

		this.minioClient = new Client({
			endPoint: 'storage',
			port: 9000,
			useSSL: false,
			accessKey: ENV_MINIO_ROOT_USER,
			secretKey: ENV_MINIO_ROOT_PASSWORD
		});
	}

	private async createBucket() {
		try {
			const bucketExists = await this.minioClient.bucketExists(
				this.BUCKET_NAME
			);

			if (!bucketExists) {
				await this.minioClient.makeBucket(this.BUCKET_NAME);

				await this.minioClient.setBucketPolicy(
					this.BUCKET_NAME,
					JSON.stringify({
						Version: '2012-10-17',
						Statement: [
							{
								Effect: 'Allow',
								Principal: { AWS: ['*'] },
								Action: ['s3:GetObject'],
								Resource: [`arn:aws:s3:::${this.BUCKET_NAME}/*`]
							}
						]
					})
				);
			}
		} catch (error) {
			logger('MinioStorage.createBucket', error);
		}
	}

	async upload(file: File, path: string): Promise<string> {
		await this.createBucket();

		await this.minioClient.putObject(
			this.BUCKET_NAME,
			path,
			Buffer.from(await file.arrayBuffer())
		);

		const publicUrl = `https://${ENV_MINIO_ENDPOINT}/${this.BUCKET_NAME}/${path}`;

		return publicUrl;
	}

	async delete(path: string): Promise<void> {
		await this.minioClient.removeObject(this.BUCKET_NAME, path);
	}
}
