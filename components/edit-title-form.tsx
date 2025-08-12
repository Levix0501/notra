import { useState, useRef, useEffect, KeyboardEventHandler } from 'react';

import { Input } from '@/components/ui/input';

export interface EditTitleFormProps {
	defaultTitle: string;
	onSubmit: (title: string) => void;
}

export default function EditTitleForm({
	defaultTitle,
	onSubmit
}: Readonly<EditTitleFormProps>) {
	const inputRef = useRef<HTMLInputElement>(null);

	const [title, setTitle] = useState(defaultTitle);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.select();
		}
	}, []);

	const handleSubmit = () => {
		onSubmit(title.trim());
	};

	const handleBlur = () => {
		handleSubmit();
	};

	const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === 'Enter') {
			handleSubmit();
		}
	};

	return (
		<div className="h-6 flex-1">
			<Input
				ref={inputRef}
				autoFocus
				className="size-full rounded-sm bg-background px-1 text-sm !ring-0 !ring-offset-0"
				value={title}
				onBlur={handleBlur}
				onChange={(e) => setTitle(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
}
