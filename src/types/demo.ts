import { BookEntity, DocEntity, TreeNodeEntity } from '@prisma/client';
import { Dexie, type EntityTable } from 'dexie';

export type DemoDB = Dexie & {
	books: EntityTable<BookEntity, 'id'>;
	docs: EntityTable<DocEntity, 'id'>;
	treeNodes: EntityTable<TreeNodeEntity, 'id'>;
};
