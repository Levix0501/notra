import { BookEntity, TreeNodeEntity, TreeNodeType } from '@prisma/client';
import { z } from 'zod';

import { getTranslations } from '@/i18n';

export type TreeNodeVo = Omit<
	TreeNodeEntity,
	'createdAt' | 'updatedAt' | 'bookId'
>;

export type TreeNodeVoWithLevel = TreeNodeVo & {
	level: number;
};

export interface TreeNodeView extends TreeNodeVoWithLevel {
	minReachLevel: number;
	maxReachLevel: number;
}

export type CreateTreeNodeDto = {
	bookId: TreeNodeEntity['bookId'];
	parentId: TreeNodeEntity['parentId'];
	type: TreeNodeType;
};

export const NavItemFormSchema = z.object({
	title: z
		.string()
		.min(1, { message: getTranslations('types_tree_node').title_required }),
	type: z.enum(['GROUP', 'DOC', 'LINK']),
	url: z
		.string()
		.regex(/^$|^https?:\/\/|^\//, {
			message: getTranslations('types_tree_node').url_regex
		})
		.optional(),
	isExternal: z.boolean().optional()
});

export type NavItemFormValues = z.infer<typeof NavItemFormSchema>;

export type CreateNavItemDto = {
	parentId: TreeNodeEntity['parentId'];
	type: TreeNodeType;
	bookId: BookEntity['id'];
	title: TreeNodeEntity['title'];
	url: TreeNodeEntity['url'];
	isExternal: TreeNodeEntity['isExternal'];
};

export type UpdateNavItemDto = {
	id: TreeNodeEntity['id'];
	type: TreeNodeType;
	title: TreeNodeEntity['title'];
	url: TreeNodeEntity['url'];
	isExternal: TreeNodeEntity['isExternal'];
};

export type NavItemVo = TreeNodeVoWithLevel & {
	children: NavItemVo[];
};
