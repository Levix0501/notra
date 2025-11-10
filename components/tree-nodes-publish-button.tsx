'use client';

import { BookEntity } from '@prisma/client';
import { useState } from 'react';
import { toast } from 'sonner';

import { publishTreeNodes } from '@/actions/tree-node';
import { getTranslations } from '@/i18n';
import {
	useGetContactInfoTreeNodes,
	useGetNavbarTreeNodes
} from '@/queries/tree-node';
import {
	CONTACT_INFO_MAP,
	mutateTree,
	NAVBAR_MAP,
	TreeNodeMap
} from '@/stores/tree';

import { SubmitButton } from './submit-button';

const t = getTranslations('components_tree_nodes_publish_button');

const TreeNodesPublishButton = ({
	bookId,
	nodeMap,
	isLoading
}: {
	bookId: BookEntity['id'];
	nodeMap: TreeNodeMap;
	isLoading: boolean;
}) => {
	const [isPending, setIsPending] = useState(false);

	const handlePublish = () => {
		setIsPending(true);
		const promise = (async () => {
			const result = await publishTreeNodes(bookId);

			if (!result.success) {
				setIsPending(false);

				throw new Error(result.message);
			}

			setIsPending(false);
			mutateTree(bookId, nodeMap);
		})();

		toast.promise(promise, {
			loading: t.publish_loading,
			success: t.publish_success,
			error: t.publish_error
		});
	};

	return (
		<SubmitButton
			className="w-auto"
			disabled={isLoading}
			isPending={isPending}
			onClick={handlePublish}
		>
			{t.publish}
		</SubmitButton>
	);
};

export const NavbarPublishButton = ({
	bookId
}: {
	bookId: BookEntity['id'];
}) => {
	const { isLoading } = useGetNavbarTreeNodes(bookId);

	return (
		<TreeNodesPublishButton
			bookId={bookId}
			isLoading={isLoading}
			nodeMap={NAVBAR_MAP}
		/>
	);
};

export const ContactInfoPublishButton = ({
	bookId
}: {
	bookId: BookEntity['id'];
}) => {
	const { isLoading } = useGetContactInfoTreeNodes(bookId);

	return (
		<TreeNodesPublishButton
			bookId={bookId}
			isLoading={isLoading}
			nodeMap={CONTACT_INFO_MAP}
		/>
	);
};
