'use client';

import { Plus } from 'lucide-react';

import { getTranslations } from '@/i18n';

import { useNavItemSheet } from './nav-item-sheet';
import { Button } from './ui/button';

const t = getTranslations('components_nav_item_add_button');

export const NavItemAddButton = () => {
	const handleAdd = () => {
		useNavItemSheet.setState({
			open: true,
			parentTreeNodeId: null,
			id: null
		});
	};

	return (
		<Button className="" variant="outline" onClick={handleAdd}>
			<Plus />
			{t.add}
		</Button>
	);
};
