import { imageSize } from 'image-size';

import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import storage from '@/lib/storage';
import { encryptFileMD5 } from '@/lib/utils';

export default class FileService {
	static async uploadFile(file: File) {
		try {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const hash = encryptFileMD5(buffer);

			let fileEntity = await prisma.fileEntity.findUnique({
				where: {
					hash
				}
			});

			if (fileEntity) {
				return ServiceResult.success(fileEntity);
			}

			const nameArray = file.name.split('.');
			const suffix = nameArray.pop();
			const mimeType = file.type;
			const metadata = mimeType.startsWith('image') ? imageSize(buffer) : null;
			const size = file.size;

			const url = await storage.upload(
				file,
				nameArray.length >= 1 ? `${hash}.${suffix}` : `${hash}`
			);

			fileEntity = await prisma.fileEntity.create({
				data: {
					hash,
					url,
					width: metadata?.width ?? 1,
					height: metadata?.height ?? 1,
					size,
					mimeType
				}
			});

			return ServiceResult.success(fileEntity);
		} catch (error) {
			logger('FileService.uploadFile', error);
			const t = getTranslations('services_file');

			return ServiceResult.fail(t.upload_error);
		}
	}
}
