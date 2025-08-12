'use client';

import {
	FocusEventHandler,
	KeyboardEventHandler,
	useEffect,
	useRef,
	useState
} from 'react';

import { Input } from '@/components/ui/input';
import { useGetDocMeta } from '@/queries/doc';
import useDoc from '@/stores/doc';

export default function HeaderEditableTitle() {
	const inputRef = useRef<HTMLInputElement>(null);

	const [isEditing, setIsEditing] = useState(false);

	const slug = useDoc((state) => state.slug);
	const { data } = useGetDocMeta(slug);

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

		console.log(newTitle);
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
		</div>
	);
}
