'use client';

import { Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
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
	className?: string;
	title: string;
	placeholder: ReactNode;
	defaultImage: Nullable<string>;
	aspectRatio: number;
	disabled?: boolean;
	maxSize?: number;
	onCrop: (croppedFile: File | null) => void;
}

export function ImageCropper({
	className,
	title,
	aspectRatio = 1,
	defaultImage,
	placeholder,
	disabled = false,
	maxSize = 10,
	onCrop
}: Readonly<ImageCropperProps>) {
	const cropperRef = useRef<ReactCropperElement>(null);

	const [croppedImage, setCroppedImage] = useState(defaultImage ?? null);
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

	const previewUnoptimized =
		typeof croppedImage === 'string' && croppedImage.startsWith('data:');

	return (
		<>
			<AspectRatio className={disabled ? 'opacity-50' : ''} ratio={aspectRatio}>
				{croppedImage ? (
					<button
						className={cn(
							'group/cropper relative size-full rounded-md border border-input p-2',
							!disabled && 'cursor-pointer',
							className
						)}
						type="button"
						onClick={!disabled ? openFilePicker : void 0}
					>
						<div className="relative size-full overflow-hidden">
							<Image
								fill
								alt="preview"
								className="object-cover"
								sizes="100%"
								src={croppedImage}
								unoptimized={previewUnoptimized}
							/>
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
						type="button"
						onClick={!disabled ? openFilePicker : void 0}
					>
						{placeholder}
					</button>
				)}
			</AspectRatio>

			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
					<AlertDialogHeader className="shrink-0 border-b px-6 py-4 text-left">
						<AlertDialogTitle>{title}</AlertDialogTitle>
					</AlertDialogHeader>

					<AlertDialogDescription className="sr-only">
						{t.title_crop_area}
					</AlertDialogDescription>

					<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-4">
						<div className="relative mx-auto w-full max-w-full overflow-hidden rounded-md border bg-muted/30">
							<div className="relative mx-auto aspect-square max-h-[min(500px,60vh)] w-full max-w-[min(500px,60vh)] overflow-hidden">
								{image ? (
									<Cropper
										ref={cropperRef}
										aspectRatio={aspectRatio}
										autoCropArea={1}
										className="cropper-dialog block h-full max-h-full w-full"
										dragMode="move"
										src={image}
										viewMode={2}
									/>
								) : null}
							</div>
						</div>

						<Button
							className="mt-4 w-fit cursor-pointer self-start"
							variant="outline"
							onClick={openFilePicker}
						>
							<Upload />
							{t.re_select}
						</Button>
					</div>

					<AlertDialogFooter className="shrink-0 gap-2 border-t bg-background px-6 py-4 sm:justify-end">
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
