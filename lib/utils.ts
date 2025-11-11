import { createHash } from 'crypto';

import { FileEntity } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import { http } from '@/lib/http';

import { HttpError } from './http/errors/http-error';
import { WrappedResponseError } from './http/errors/wrapped-response-error';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Process error and fallback to a handler if the error is not an instance of HttpError or WrappedResponseError
 * @param error - The error to process
 * @param fallbackHandler - The handler to fallback to if the error is not an instance of HttpError or WrappedResponseError
 */
export const processError = (error: unknown, fallbackHandler: () => void) => {
	if (error instanceof HttpError) {
		toast.error(error.message);
	} else if (error instanceof WrappedResponseError) {
		toast.error(error.message);
	} else {
		fallbackHandler();
	}
};

/**
 * Encrypt a file using MD5 to get a hash which is a fingerprint for the file
 * @param buffer - The file buffer
 * @returns The encrypted file
 */
export function encryptFileMD5(buffer: Buffer) {
	const md5 = createHash('md5');

	return md5.update(buffer).digest('hex');
}

/**
 * Convert a canvas element to a file
 * @param canvas - The canvas element to convert
 * @param fileName - The name of the file
 * @param mimeType - The mime type of the file
 * @param quality - The quality of the file
 */
export const canvasToFile = (
	canvas: HTMLCanvasElement,
	fileName: string,
	mimeType = 'image/png',
	quality = 1
): Promise<File> => {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) {
					resolve(new File([blob], fileName, { type: mimeType }));
				} else {
					reject(new Error('Canvas toBlob failed'));
				}
			},
			mimeType,
			quality
		);
	});
};

/**
 * Upload a file to the server
 * @param file - The file to upload
 * @returns The uploaded file
 */
export const uploadFile = async (file: File) => {
	const formData = new FormData();

	formData.append('file', file);

	const result = await http.post<FileEntity>('/api/files/upload', {
		data: formData
	});

	return result;
};

export const getToc = (docContent: JSONContent) => {
	if (docContent.type === 'doc' && docContent.content) {
		return docContent.content
			.filter(
				(node) =>
					node.type === 'heading' &&
					node.attrs?.level &&
					node.attrs.level <= 3 &&
					node.content?.length === 1 &&
					node.content[0].type === 'text'
			)
			.map((node) => {
				return {
					id: `h${node.attrs?.level}-${docContent.content?.indexOf(node)}`,
					text: node.content![0].text as string,
					level: node.attrs!.level as number
				};
			});
	}

	return [];
};
