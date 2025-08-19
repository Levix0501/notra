'use client';

import { useEditorRef } from 'platejs/react';
import {
	ChangeEventHandler,
	FocusEventHandler,
	KeyboardEventHandler,
	useEffect,
	useRef,
	useState
} from 'react';

import { Textarea } from '@/components/ui/textarea';
import { useEditDocTitle } from '@/hooks/use-edit-doc-title';
import { getTranslations } from '@/i18n';
import { useCurrentDocMeta } from '@/stores/doc';

const t = getTranslations('hooks_use_edit_doc_title');

export default function TitleTextarea() {
	const ref = useRef<HTMLTextAreaElement>(null);

	const [title, setTitle] = useState('');

	const editor = useEditorRef();
	const { data } = useCurrentDocMeta();
	const handleEditDocTitle = useEditDocTitle();

	useEffect(() => {
		setTitle(data?.title ?? '');
	}, [data?.title]);

	const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		setTitle(e.target.value);
	};

	const handleBlur: FocusEventHandler<HTMLTextAreaElement> = (e) => {
		const inputValue = e.target.value.trim();
		const newTitle = inputValue.length === 0 ? t.untitled : inputValue;

		setTitle(newTitle);
		handleEditDocTitle(newTitle);
	};

	const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === 'Enter') {
			ref.current?.blur();
			editor.tf.focus({ at: [0, 0], edge: 'start' });
		}
	};

	return (
		<div className="mt-6 px-16 pt-4 pb-1 text-base sm:px-[max(64px,calc(50%-350px))]">
			<Textarea
				ref={ref}
				className="min-h-12.5 resize-none rounded-none border-none p-0 !text-4xl leading-12.5 font-bold shadow-none outline-none focus-visible:border-none focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none"
				rows={1}
				spellCheck={false}
				value={title}
				onBlur={handleBlur}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
}
