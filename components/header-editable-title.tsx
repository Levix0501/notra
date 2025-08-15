'use client';

import {
	FocusEventHandler,
	KeyboardEventHandler,
	useEffect,
	useRef,
	useState
} from 'react';

import { Input } from '@/components/ui/input';
import { useEditDocTitle } from '@/hooks/use-edit-doc-title';
import { useGetDocMeta } from '@/queries/doc';
import { useCurrentBook } from '@/stores/book';
import useDoc from '@/stores/doc';

import AutoSaveTip from './auto-save-tip';

export default function HeaderEditableTitle() {
	const inputRef = useRef<HTMLInputElement>(null);

	const [isEditing, setIsEditing] = useState(false);

	const { data: book } = useCurrentBook();
	const slug = useDoc((state) => state.slug);
	const { data } = useGetDocMeta(
		{ book: book?.slug, doc: slug },
		{
			onSuccess(data) {
				const titleArray = document.title.split(' - ');

				if (titleArray.length > 1) {
					document.title = data.title + ' - ' + titleArray[1];
				} else {
					document.title = data.title;
				}
			}
		}
	);
	const handleEditDocTitle = useEditDocTitle();

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.select();
		}
	}, [isEditing]);

	if (!data) {
		return null;
	}

	const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
		const newTitle = e.target.value;

		handleEditDocTitle(newTitle);
		setIsEditing(false);
	};

	const handleClick = () => {
		setIsEditing(true);
	};

	const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === 'Enter') {
			inputRef.current?.blur();
		}
	};

	if (isEditing) {
		return (
			<Input
				ref={inputRef}
				autoFocus
				className="w-[200px]"
				defaultValue={data.title}
				maxLength={128}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
			/>
		);
	}

	return (
		<div
			className="flex cursor-pointer flex-col gap-0"
			role="button"
			onClick={handleClick}
		>
			<div className="max-w-[120px] min-w-[100px] truncate text-start text-sm font-normal text-secondary-foreground hover:bg-transparent hover:text-secondary-foreground md:max-w-[400px]">
				{data.title}
			</div>
			<AutoSaveTip />
		</div>
	);
}
