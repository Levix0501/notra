'use client';

import { Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { useEffect, useRef } from 'react';

import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/editor/ui/editor';

interface EditorCoreProps {
	initialValue?: Value;
	onValueChange?: (value: Value) => void;
}

export function EditorCore({
	initialValue,
	onValueChange
}: Readonly<EditorCoreProps>) {
	const hasInitialized = useRef(false);

	const editor = usePlateEditor({
		plugins: EditorKit,
		value: initialValue
	});

	useEffect(() => {
		if (initialValue && !hasInitialized.current) {
			editor.tf.setValue(initialValue);
		}
	}, [editor.tf, initialValue]);

	const handleValueChange = ({ value }: { value: Value }) => {
		if (!hasInitialized.current) {
			hasInitialized.current = true;

			return;
		}

		onValueChange?.(value);
	};

	return (
		<Plate editor={editor} onValueChange={handleValueChange}>
			<EditorContainer>
				<Editor />
			</EditorContainer>
		</Plate>
	);
}
