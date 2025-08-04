'use client';

import { ImageCropper } from '@/components/image-cropper';
import { uploadFile } from '@/lib/utils';

export function TestUploadFile() {
	return (
		<div className="flex items-center justify-center">
			<div className="size-52">
				<ImageCropper
					aspectRatio={1}
					defaultImage={null}
					placeholder={<div>Upload File</div>}
					title="Upload File"
					onCrop={async (croppedFile) => {
						console.log(croppedFile);

						if (croppedFile) {
							const result = await uploadFile(croppedFile);

							console.log(result);
						}
					}}
				/>
			</div>
		</div>
	);
}
