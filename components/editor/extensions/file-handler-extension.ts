import { FileHandler as FileHandlerBase } from '@tiptap/extension-file-handler';

import { handleImageUpload, MAX_FILE_SIZE } from '../tiptap-utils';

export const FileHandler = FileHandlerBase.configure({
	allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
	onPaste: (editor, files) => {
		files.forEach((file) => {
			const imageUploadNode = {
				type: 'imageUpload',
				attrs: {
					accept: 'image/*',
					maxSize: MAX_FILE_SIZE,
					limit: 1,
					upload: handleImageUpload,
					onError: (error: Error) => console.error('Upload failed:', error),
					pasteFile: file
				}
			};

			editor.chain().focus().insertContent(imageUploadNode).run();
		});

		return true;
	}
});
