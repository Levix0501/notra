import { CatalogNodeEntity } from '@prisma/client';

export type CatalogNodeVo = Omit<
	CatalogNodeEntity,
	'createdAt' | 'updatedAt' | 'bookId'
>;

export type CatalogNodeVoWithLevel = CatalogNodeVo & {
	level: number;
};

export interface CatalogNodeView extends CatalogNodeVoWithLevel {
	minReachLevel: number;
	maxReachLevel: number;
}
