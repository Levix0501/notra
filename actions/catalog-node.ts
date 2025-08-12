'use server';

import { CatalogNodeEntity } from '@prisma/client';

import CatalogNodeService from '@/services/catalog-node';

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
