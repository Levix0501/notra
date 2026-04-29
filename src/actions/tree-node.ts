'use server';

import { BookEntity, TreeNodeEntity, DocEntity } from '@prisma/client';

import { TreeNodeService } from '@/services/tree-node';
import {
	CreateContactInfoDto,
	CreateNavItemDto,
	CreateTreeNodeDto,
	DeleteTreeNodeWithChildrenDto,
	MoveAfterDto,
	PrependChildDto,
	UpdateContactInfoDto,
	UpdateNavItemDto,
	UpdateTreeNodeTitleDto
} from '@/types/tree-node';

export const createTreeNode = async (dto: CreateTreeNodeDto) => {
	const serviceResult = await TreeNodeService.createTreeNode(dto);

	return serviceResult.toPlainObject();
};

export const deleteTreeNodeWithChildren = async (
	dto: DeleteTreeNodeWithChildrenDto
) => {
	const serviceResult = await TreeNodeService.deleteWithChildren(dto);

	return serviceResult.toPlainObject();
};

export const prependChild = async (dto: PrependChildDto) => {
	const serviceResult = await TreeNodeService.prependChild(dto);

	return serviceResult.toPlainObject();
};

export const moveAfter = async (dto: MoveAfterDto) => {
	const serviceResult = await TreeNodeService.moveAfter(dto);

	return serviceResult.toPlainObject();
};

export const updateTreeNodeTitle = async (dto: UpdateTreeNodeTitleDto) => {
	const serviceResult = await TreeNodeService.updateTitle(dto);

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
