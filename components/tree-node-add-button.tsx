'use client';

import { BookEntity } from '@prisma/client';
import { Plus } from 'lucide-react';

import { getTranslations } from '@/i18n';
import {
	useGetContactInfoTreeNodes,
	useGetNavbarTreeNodes
} from '@/queries/tree-node';

import { useContactInfoSheet } from './contact-info-sheet';
import { useNavItemSheet } from './nav-item-sheet';
import { Button } from './ui/button';

const t = getTranslations('components_tree_node_add_button');

interface TreeNodeAddButtonProps {
	isLoading: boolean;
	onClick: () => void;
}

const TreeNodeAddButton = ({ isLoading, onClick }: TreeNodeAddButtonProps) => {
	return (
		<Button disabled={isLoading} variant="outline" onClick={onClick}>
			<Plus />
			{t.add}
		</Button>
	);
};

export const NavItemAddButton = ({ bookId }: { bookId: BookEntity['id'] }) => {
	const { isLoading } = useGetNavbarTreeNodes(bookId);

	return (
		<TreeNodeAddButton
			isLoading={isLoading}
			onClick={() =>
				useNavItemSheet.setState({
					open: true,
					parentTreeNodeId: null,
					id: null
				})
			}
		/>
	);
};

export const ContactInfoAddButton = ({
	bookId
}: {
	bookId: BookEntity['id'];
}) => {
	const { isLoading } = useGetContactInfoTreeNodes(bookId);

	return (
		<TreeNodeAddButton
			isLoading={isLoading}
			onClick={() =>
				useContactInfoSheet.setState({
					open: true,
					id: null
				})
			}
		/>
	);
};
