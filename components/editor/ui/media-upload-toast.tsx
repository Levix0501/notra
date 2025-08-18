'use client';

import { PlaceholderPlugin, UploadErrorCode } from '@platejs/media/react';
import { usePluginOption } from 'platejs/react';
import * as React from 'react';
import { toast } from 'sonner';

import { getTranslations } from '@/i18n';

export function MediaUploadToast() {
	useUploadErrorToast();

	return null;
}

const useUploadErrorToast = () => {
	const uploadError = usePluginOption(PlaceholderPlugin, 'error');

	React.useEffect(() => {
		if (!uploadError) return;

		const { code, data } = uploadError;

		switch (code) {
			case UploadErrorCode.INVALID_FILE_SIZE: {
				toast.error(
					`The size of files ${data.files
						.map((f) => f.name)
						.join(', ')} is invalid`
				);

				break;
			}

			case UploadErrorCode.INVALID_FILE_TYPE: {
				toast.error(
					`The type of files ${data.files
						.map((f) => f.name)
						.join(', ')} is invalid`
				);

				break;
			}

			case UploadErrorCode.TOO_LARGE: {
				toast.error(
					getTranslations(
						'notra_editor'
					).media_upload_toast_file_size_error.replace(
						'{size}',
						data.maxFileSize
					)
				);

				break;
			}

			case UploadErrorCode.TOO_LESS_FILES: {
				toast.error(
					`The mini um number of files is ${data.minFileCount} for ${data.fileType}`
				);

				break;
			}

			case UploadErrorCode.TOO_MANY_FILES: {
				toast.error(
					getTranslations(
						'notra_editor'
					).media_upload_toast_file_count_error.replace(
						'{count}',
						data.maxFileCount.toString()
					)
				);

				break;
			}
		}
	}, [uploadError]);
};
