'use client';

import { MousePointerClick } from 'lucide-react';

import { useCreateBookDialog } from './create-book-dialog';
import { Button } from './ui/button';

interface TryItButtonProps {
	label: string;
}

export const TryItButton = ({ label }: TryItButtonProps) => {
	const handleClick = () => {
		useCreateBookDialog.setState({
			open: true
		});
	};

	return (
		<Button
			className="px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30"
			size="lg"
			onClick={handleClick}
		>
			<MousePointerClick />
			{label}
		</Button>
	);
};
