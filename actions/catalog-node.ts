'use server';

import { BookEntity, CatalogNodeEntity, DocEntity } from '@prisma/client';

import CatalogNodeService from '@/services/catalog-node';
import { Nullable } from '@/types/common';

export const createStack = async (
	bookId: CatalogNodeEntity['bookId'],
	parentId: CatalogNodeEntity['parentId']
) => {
	const serviceResult = await CatalogNodeService.createStack(bookId, parentId);

	return serviceResult.toPlainObject();
};

export const createDoc = async (
	bookId: CatalogNodeEntity['bookId'],
	parentId: CatalogNodeEntity['parentId']
) => {
	const serviceResult = await CatalogNodeService.createDoc(bookId, parentId);

	return serviceResult.toPlainObject();
};

export const deleteWithChildren = async ({
	nodeId,
	bookId
}: {
	nodeId: CatalogNodeEntity['id'];
	bookId: CatalogNodeEntity['bookId'];
}) => {
	const serviceResult = await CatalogNodeService.deleteWithChildren({
		nodeId,
		bookId
	});

	return serviceResult.toPlainObject();
};

export const prependChild = async ({
	bookId,
	nodeId,
	targetId
}: {
	bookId: CatalogNodeEntity['bookId'];
	nodeId: CatalogNodeEntity['id'];
	targetId: Nullable<CatalogNodeEntity['id']>;
}) => {
	const serviceResult = await CatalogNodeService.prependChild({
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
	bookId: CatalogNodeEntity['bookId'];
	nodeId: CatalogNodeEntity['id'];
	targetId: CatalogNodeEntity['id'];
}) => {
	const serviceResult = await CatalogNodeService.moveAfter({
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
	id: CatalogNodeEntity['id'];
	title: CatalogNodeEntity['title'];
}) => {
	const serviceResult = await CatalogNodeService.updateTitle({ id, title });

	return serviceResult.toPlainObject();
};

export const publishWithParent = async (publishDto: {
	nodeIds: CatalogNodeEntity['id'][];
	docIds: DocEntity['id'][];
	bookId: BookEntity['id'];
}) => {
	const serviceResult = await CatalogNodeService.publish(publishDto);

	return serviceResult.toPlainObject();
};

export const unpublishWithChildren = async (unpublishDto: {
	nodeIds: CatalogNodeEntity['id'][];
	docIds: DocEntity['id'][];
	bookId: BookEntity['id'];
}) => {
	const serviceResult = await CatalogNodeService.unpublish(unpublishDto);

	return serviceResult.toPlainObject();
};
