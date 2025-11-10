'use server';

import { BookEntity, TreeNodeEntity, DocEntity } from '@prisma/client';

import { TreeNodeService } from '@/services/tree-node';
import { Nullable } from '@/types/common';
import {
	CreateContactInfoDto,
	CreateNavItemDto,
	CreateTreeNodeDto,
	UpdateContactInfoDto,
	UpdateNavItemDto
} from '@/types/tree-node';

export const createTreeNode = async (createTreeNodeDto: CreateTreeNodeDto) => {
	const serviceResult = await TreeNodeService.createTreeNode(createTreeNodeDto);

	return serviceResult.toPlainObject();
};

export const deleteNodeWithChildren = async (deleteDto: {
	nodeId: TreeNodeEntity['id'];
	nodeIds: TreeNodeEntity['id'][];
	docIds: DocEntity['id'][];
	bookId: TreeNodeEntity['bookId'];
}) => {
	const serviceResult = await TreeNodeService.deleteWithChildren(deleteDto);

	return serviceResult.toPlainObject();
};

export const prependChild = async ({
	bookId,
	nodeId,
	targetId
}: {
	bookId: TreeNodeEntity['bookId'];
	nodeId: TreeNodeEntity['id'];
	targetId: Nullable<TreeNodeEntity['id']>;
}) => {
	const serviceResult = await TreeNodeService.prependChild({
		bookId,
		nodeId,
		targetId
	});

	return serviceResult.toPlainObject();
};

export const moveAfter = async ({
	bookId,
	nodeId,
	targetId
}: {
	bookId: TreeNodeEntity['bookId'];
	nodeId: TreeNodeEntity['id'];
	targetId: TreeNodeEntity['id'];
}) => {
	const serviceResult = await TreeNodeService.moveAfter({
		bookId,
		nodeId,
		targetId
	});

	return serviceResult.toPlainObject();
};

export const updateTitle = async ({
	id,
	title
}: {
	id: TreeNodeEntity['id'];
	title: TreeNodeEntity['title'];
}) => {
	const serviceResult = await TreeNodeService.updateTitle({
		id,
		title
	});

	return serviceResult.toPlainObject();
};

export const publishWithParent = async (publishDto: {
	nodeIds: TreeNodeEntity['id'][];
	docIds: DocEntity['id'][];
	bookId: BookEntity['id'];
	bookType: BookEntity['type'];
}) => {
	const serviceResult = await TreeNodeService.publish(publishDto);

	return serviceResult.toPlainObject();
};

export const unpublishWithChildren = async (unpublishDto: {
	nodeIds: TreeNodeEntity['id'][];
	docIds: DocEntity['id'][];
	bookId: BookEntity['id'];
	bookType: BookEntity['type'];
}) => {
	const serviceResult = await TreeNodeService.unpublish(unpublishDto);

	return serviceResult.toPlainObject();
};

export const createNavItem = async (createNavItemDto: CreateNavItemDto) => {
	const serviceResult = await TreeNodeService.createNavItem(createNavItemDto);

	return serviceResult.toPlainObject();
};

export const updateNavItem = async (updateNavItemDto: UpdateNavItemDto) => {
	const serviceResult = await TreeNodeService.updateNavItem(updateNavItemDto);

	return serviceResult.toPlainObject();
};

export const publishTreeNodes = async (bookId: BookEntity['id']) => {
	const serviceResult = await TreeNodeService.publishTreeNodes(bookId);

	return serviceResult.toPlainObject();
};

export const createContactInfo = async (
	createContactInfoDto: CreateContactInfoDto
) => {
	const serviceResult =
		await TreeNodeService.createContactInfo(createContactInfoDto);

	return serviceResult.toPlainObject();
};

export const updateContactInfo = async (
	updateContactInfoDto: UpdateContactInfoDto
) => {
	const serviceResult =
		await TreeNodeService.updateContactInfo(updateContactInfoDto);

	return serviceResult.toPlainObject();
};
