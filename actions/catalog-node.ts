'use server';

import { CatalogNodeEntity } from '@prisma/client';

import CatalogNodeService from '@/services/catalog-node';
import { Nullable } from '@/types/common';

export const createStack = async (
	bookId: CatalogNodeEntity['bookId'],
	parentId: CatalogNodeEntity['parentId']
) => {
	const serviceResult = await CatalogNodeService.createStack(bookId, parentId);

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
