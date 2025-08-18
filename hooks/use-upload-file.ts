import { FileEntity } from '@prisma/client';
import axios from 'axios';
import * as React from 'react';
import { toast } from 'sonner';

import { getTranslations } from '@/i18n';
import { WrappedResponse } from '@/types/common';

export type UploadedFile = {
	name: string;
	url: string;
	width: number;
	height: number;
};

export const useUploadFile = () => {
	const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
	const [uploadingFile, setUploadingFile] = React.useState<File>();
	const [progress, setProgress] = React.useState<number>(0);
	const [isUploading, setIsUploading] = React.useState(false);

	async function uploadFile(file: File) {
		setIsUploading(true);
		setUploadingFile(file);

		const formData = new FormData();

		formData.append('file', file);

		try {
			const res = await axios.post('/api/files/upload', formData, {
				onUploadProgress: ({ progress }) => {
					setProgress(Math.floor(((progress ?? 0) * 100) / 2));

					if ((progress ?? 0) === 1) {
						let p = 50;

						const simulateProgress = async () => {
							while (p < 99) {
								await new Promise((resolve) => setTimeout(resolve, 100));
								setProgress((prev) => {
									p = prev + 1;

									return Math.min(p, 100);
								});
							}
						};

						simulateProgress();
					}
				}
			});

			const wrappedResponse = res.data as WrappedResponse<FileEntity>;

			if (!wrappedResponse.success) {
				throw new Error(wrappedResponse.message);
			}

			setUploadedFile({
				name: wrappedResponse.data.hash,
				url: wrappedResponse.data.url,
				width: wrappedResponse.data.width,
				height: wrappedResponse.data.height
			});
			setProgress(100);
		} catch {
			toast.error(getTranslations('hooks_use_upload_file').upload_error);
		} finally {
			setProgress(0);
			setIsUploading(false);
			setUploadingFile(undefined);
		}
	}

	return {
		isUploading,
		progress,
		uploadedFile,
		uploadFile,
		uploadingFile
	};
};
