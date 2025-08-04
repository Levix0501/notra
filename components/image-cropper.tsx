'use client';

import { Trash2, Upload } from 'lucide-react';
import { useRef, useState, ReactNode } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { toast } from 'sonner';
import { useFilePicker } from 'use-file-picker';
import {
	FileTypeValidator,
	FileSizeValidator
} from 'use-file-picker/validators';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogDescription
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { getTranslations } from '@/i18n';
import { canvasToFile, cn } from '@/lib/utils';
import { Nullable } from '@/types/common';

import { AspectRatio } from './ui/aspect-ratio';

import 'cropperjs/dist/cropper.css';

const t = getTranslations('components_image_cropper');

interface ImageCropperProps {
	title: string;
	placeholder: ReactNode;
	defaultImage: Nullable<string>;
	aspectRatio: number;
	disabled?: boolean;
	maxSize?: number;
	onCrop: (croppedFile: File | null) => void;
}

export function ImageCropper({
	title,
	aspectRatio = 1,
	defaultImage,
	placeholder,
	disabled = false,
	maxSize = 10,
	onCrop
}: ImageCropperProps) {
	const cropperRef = useRef<ReactCropperElement>(null);

	const [croppedImage, setCroppedImage] = useState(defaultImage || null);
	const [image, setImage] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { openFilePicker } = useFilePicker({
		readAs: 'DataURL',
		accept: ['image/*'],
		multiple: false,
		validators: [
			new FileTypeValidator(['jpg', 'png']),
			new FileSizeValidator({ maxFileSize: maxSize * 1024 * 1024 })
		],
		onFilesRejected: ({ errors }) => {
			if (errors.length > 0) {
				switch (errors[0].name) {
					case 'FileTypeError':
						toast.error(t.file_type_error);
						break;
					case 'FileSizeError':
						toast.error(t.max_size.replace('{size}', maxSize.toString()));
						break;
				}
			}
		},
		onFilesSuccessfullySelected: ({ filesContent }) => {
			setImage(filesContent[0].content);
			setIsDialogOpen(true);
		}
	});

	const handleCrop = async () => {
		const cropper = cropperRef.current?.cropper;

		if (cropper) {
			const croppedCanvas = cropper.getCroppedCanvas();
			const croppedDataUrl = croppedCanvas.toDataURL();

			setCroppedImage(croppedDataUrl);

			const croppedFile = await canvasToFile(croppedCanvas, 'cropped.png');

			onCrop(croppedFile);
			setIsDialogOpen(false);
		}
	};

	const handleRemoveImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		setCroppedImage(null);
		onCrop(null);
	};

	return (
		<>
			<AspectRatio className={disabled ? 'opacity-50' : ''} ratio={aspectRatio}>
				{croppedImage ? (
					<button
						className={cn(
							'group/cropper relative size-full rounded-md border border-input p-2',
							!disabled && 'cursor-pointer'
						)}
						onClick={!disabled ? openFilePicker : void 0}
					>
						<div className="size-full overflow-hidden">
							<picture>
								<img
									alt="Image preview"
									className="size-full object-cover"
									src={croppedImage}
								/>
							</picture>
						</div>
						<div className="absolute inset-0 p-2">
							{!disabled && (
								<div className="flex size-full items-center justify-center bg-black/65 text-primary-foreground opacity-0 transition-opacity group-hover/cropper:opacity-100 dark:bg-white/65">
									<Trash2
										className="size-4 text-white dark:text-black"
										onClick={handleRemoveImage}
									/>
								</div>
							)}
						</div>
					</button>
				) : (
					<button
						className={cn(
							'flex size-full items-center justify-center rounded-md border border-dashed border-input transition-colors duration-300 select-none',
							!disabled && 'cursor-pointer hover:border-primary'
						)}
						onClick={!disabled ? openFilePicker : void 0}
					>
						{placeholder}
					</button>
				)}
			</AspectRatio>

			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{title}</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogDescription></AlertDialogDescription>
					<AspectRatio ratio={aspectRatio}>
						{image && (
							<Cropper
								ref={cropperRef}
								aspectRatio={aspectRatio}
								autoCropArea={1}
								className="size-full"
								dragMode="move"
								src={image}
								viewMode={2}
							/>
						)}
					</AspectRatio>

					<Button
						className="w-fit cursor-pointer"
						variant="outline"
						onClick={openFilePicker}
					>
						<Upload />
						{t.re_select}
					</Button>

					<AlertDialogFooter className="mt-4">
						<Button
							className="cursor-pointer"
							variant="outline"
							onClick={() => setIsDialogOpen(false)}
						>
							{t.cancel}
						</Button>
						<Button className="cursor-pointer" onClick={handleCrop}>
							{t.crop}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
