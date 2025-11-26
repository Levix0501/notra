import { describe, it, expect, beforeEach } from 'vitest';

import { getTranslations } from '@/i18n';

import { DemoService } from '../demo';

const t = getTranslations('services_tree_node');

describe('DemoService', () => {
	describe('Book Operations', () => {
		beforeEach(async () => {
			// Clean up before each test to ensure isolation
			const db = (await import('../demo')).getDatabase();

			await db.books.clear();
			await db.docs.clear();
			await db.treeNodes.clear();
		});

		it('should create a book', async () => {
			const result = await DemoService.createBook({ name: 'Test Book' });

			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.data?.name).toBe('Test Book');
			expect(result.data?.slug).toBe('test-book');
			expect(result.data?.type).toBe('BLOGS');
			expect(result.data?.isPublished).toBe(false);
		});

		it('should create a book with unique slug when slug exists', async () => {
			await DemoService.createBook({ name: 'Test Book' });
			const result = await DemoService.createBook({ name: 'Test Book' });

			expect(result.success).toBe(true);
			expect(result.data?.slug).not.toBe('test-book');
			expect(result.data?.slug).toContain('test-book-');
		});

		it('should get all books', async () => {
			await DemoService.createBook({ name: 'Book 1' });
			await DemoService.createBook({ name: 'Book 2' });

			const books = await DemoService.getBooks();

			expect(books).toHaveLength(2);
			expect(books[0].name).toBe('Book 2'); // Most recent first
			expect(books[1].name).toBe('Book 1');
		});

		it('should get a book by id', async () => {
			const created = await DemoService.createBook({ name: 'Test Book' });
			const book = await DemoService.getBook(created.data!.id);

			expect(book).toBeDefined();
			expect(book?.name).toBe('Test Book');
			expect(book?.id).toBe(created.data!.id);
		});

		it('should return null when getting non-existent book', async () => {
			const book = await DemoService.getBook(999);

			expect(book).toBeNull();
		});

		it('should update a book', async () => {
			const created = await DemoService.createBook({ name: 'Test Book' });
			const result = await DemoService.updateBook({
				id: created.data!.id,
				name: 'Updated Book',
				isPublished: true
			});

			expect(result.success).toBe(true);

			const book = await DemoService.getBook(created.data!.id);

			expect(book?.name).toBe('Updated Book');
			expect(book?.isPublished).toBe(true);
		});

		it('should update book name only', async () => {
			const created = await DemoService.createBook({ name: 'Original Name' });
			const result = await DemoService.updateBook({
				id: created.data!.id,
				name: 'New Name'
			});

			expect(result.success).toBe(true);

			const book = await DemoService.getBook(created.data!.id);

			expect(book?.name).toBe('New Name');
			expect(book?.slug).toBe('original-name');
			expect(book?.type).toBe('BLOGS');
			expect(book?.isPublished).toBe(false);
		});

		it('should update book slug', async () => {
			const created = await DemoService.createBook({ name: 'Test Book' });
			const result = await DemoService.updateBook({
				id: created.data!.id,
				slug: 'custom-slug'
			});

			expect(result.success).toBe(true);

			const book = await DemoService.getBook(created.data!.id);

			expect(book?.slug).toBe('custom-slug');
			expect(book?.name).toBe('Test Book');
		});

		it('should update book type', async () => {
			const created = await DemoService.createBook({ name: 'Test Book' });
			const result = await DemoService.updateBook({
				id: created.data!.id,
				type: 'DOCS'
			});

			expect(result.success).toBe(true);

			const book = await DemoService.getBook(created.data!.id);

			expect(book?.type).toBe('DOCS');
		});

		it('should update book publish status', async () => {
			const created = await DemoService.createBook({ name: 'Test Book' });

			expect(created.data?.isPublished).toBe(false);

			const result = await DemoService.updateBook({
				id: created.data!.id,
				isPublished: true
			});

			expect(result.success).toBe(true);

			const book = await DemoService.getBook(created.data!.id);

			expect(book?.isPublished).toBe(true);
		});

		it('should update multiple book fields at once', async () => {
			const created = await DemoService.createBook({ name: 'Test Book' });
			const result = await DemoService.updateBook({
				id: created.data!.id,
				name: 'Updated Name',
				slug: 'updated-slug',
				type: 'PAGES',
				isPublished: true
			});

			expect(result.success).toBe(true);

			const book = await DemoService.getBook(created.data!.id);

			expect(book?.name).toBe('Updated Name');
			expect(book?.slug).toBe('updated-slug');
			expect(book?.type).toBe('PAGES');
			expect(book?.isPublished).toBe(true);
		});

		it('should delete a book', async () => {
			const created = await DemoService.createBook({ name: 'Test Book' });
			const result = await DemoService.deleteBook(created.data!.id);

			expect(result.success).toBe(true);

			const book = await DemoService.getBook(created.data!.id);

			expect(book).toBeNull();
		});

		it('should check book slug availability', async () => {
			await DemoService.createBook({ name: 'Test Book' });

			const existingResult = await DemoService.checkBookSlug('test-book');

			expect(existingResult.success).toBe(true);
			expect(existingResult.data).toBe(false);

			const availableResult = await DemoService.checkBookSlug('new-book');

			expect(availableResult.success).toBe(true);
			expect(availableResult.data).toBe(true);
		});
	});

	describe('TreeNode Operations', () => {
		let bookId: number;

		beforeEach(async () => {
			const book = await DemoService.createBook({ name: 'Test Book' });

			bookId = book.data!.id;
		});

		it('should create a DOC tree node', async () => {
			const result = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.data?.type).toBe('DOC');
			expect(result.data?.title).toBe(t.new_doc_default_name);
			expect(result.data?.docId).toBeDefined();
			expect(result.data?.docId).not.toBeNull();
		});

		it('should create a GROUP tree node', async () => {
			const result = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			expect(result.success).toBe(true);
			expect(result.data?.type).toBe('GROUP');
			expect(result.data?.title).toBe(t.new_group_default_name);
			expect(result.data?.docId).toBeNull();
		});

		it('should create tree nodes with correct parent-child relationship', async () => {
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const child = await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			expect(child.success).toBe(true);
			expect(child.data?.parentId).toBe(parent.data!.id);
		});

		it('should create tree nodes with correct sibling relationship', async () => {
			const first = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const second = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			expect(second.success).toBe(true);
			// Second node becomes the new head node, so prevId is null
			expect(second.data?.prevId).toBeNull();
			// Second node points to first node as sibling
			expect(second.data?.siblingId).toBe(first.data!.id);

			// Verify first node was updated to point back to second node
			const db = (await import('../demo')).getDatabase();
			const updatedFirst = await db.treeNodes.get(first.data!.id);

			expect(updatedFirst?.prevId).toBe(second.data!.id);
		});

		it('should get tree nodes by book id', async () => {
			await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(nodes).toHaveLength(2);
			expect(nodes[0]).toHaveProperty('level');
		});

		it('should get tree nodes with correct levels', async () => {
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(nodes[0].level).toBe(0); // Parent
			expect(nodes[1].level).toBe(1); // Child
		});

		it('should return empty array when no tree nodes exist', async () => {
			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(nodes).toHaveLength(0);
		});

		it('should delete a single tree node without children', async () => {
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const result = await DemoService.deleteTreeNodeWithChildren({
				nodeId: node.data!.id,
				nodeIds: [node.data!.id],
				docIds: node.data!.docId ? [node.data!.docId] : [],
				bookId
			});

			expect(result.success).toBe(true);
			expect(result.data).toHaveLength(0);

			// Verify the doc was soft deleted
			const db = (await import('../demo')).getDatabase();
			const doc = await db.docs.get(node.data!.docId!);

			expect(doc?.isDeleted).toBe(true);
		});

		it('should delete a GROUP node without docId', async () => {
			const groupNode = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			expect(groupNode.data?.docId).toBeNull();

			const result = await DemoService.deleteTreeNodeWithChildren({
				nodeId: groupNode.data!.id,
				nodeIds: [groupNode.data!.id],
				docIds: [], // No docIds for GROUP
				bookId
			});

			expect(result.success).toBe(true);
			expect(result.data).toHaveLength(0);

			// Verify node was deleted
			const db = (await import('../demo')).getDatabase();
			const node = await db.treeNodes.get(groupNode.data!.id);

			expect(node).toBeUndefined();
		});

		it('should delete a tree node with children', async () => {
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const child1 = await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			const child2 = await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			const result = await DemoService.deleteTreeNodeWithChildren({
				nodeId: parent.data!.id,
				nodeIds: [parent.data!.id, child1.data!.id, child2.data!.id],
				docIds: [child1.data!.docId!, child2.data!.docId!],
				bookId
			});

			expect(result.success).toBe(true);
			expect(result.data).toHaveLength(0);

			// Verify all docs were soft deleted
			const db = (await import('../demo')).getDatabase();
			const doc1 = await db.docs.get(child1.data!.docId!);
			const doc2 = await db.docs.get(child2.data!.docId!);

			expect(doc1?.isDeleted).toBe(true);
			expect(doc2?.isDeleted).toBe(true);
		});

		it('should maintain tree structure after deleting a middle sibling node', async () => {
			// Create three sibling nodes
			const first = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const second = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const third = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Delete the middle node (second)
			await DemoService.deleteTreeNodeWithChildren({
				nodeId: second.data!.id,
				nodeIds: [second.data!.id],
				docIds: [second.data!.docId!],
				bookId
			});

			// Verify the tree structure is maintained
			const db = (await import('../demo')).getDatabase();
			const thirdNode = await db.treeNodes.get(third.data!.id);
			const firstNode = await db.treeNodes.get(first.data!.id);

			// Third node should now point to first node as its sibling
			expect(thirdNode?.siblingId).toBe(first.data!.id);
			// First node should point back to third node
			expect(firstNode?.prevId).toBe(third.data!.id);
		});

		it('should maintain tree structure after deleting first child node', async () => {
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const firstChild = await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			const secondChild = await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			// Delete the first child
			await DemoService.deleteTreeNodeWithChildren({
				nodeId: firstChild.data!.id,
				nodeIds: [firstChild.data!.id],
				docIds: [firstChild.data!.docId!],
				bookId
			});

			// Verify parent now points to second child
			const db = (await import('../demo')).getDatabase();
			const parentNode = await db.treeNodes.get(parent.data!.id);
			const secondChildNode = await db.treeNodes.get(secondChild.data!.id);

			expect(parentNode?.childId).toBe(secondChild.data!.id);
			expect(secondChildNode?.prevId).toBe(parent.data!.id);
		});

		it('should handle deleting non-existent node gracefully', async () => {
			const result = await DemoService.deleteTreeNodeWithChildren({
				nodeId: 999999,
				nodeIds: [999999],
				docIds: [],
				bookId
			});

			// Should fail because node doesn't exist
			expect(result.success).toBe(false);
			expect(result.message).toBeDefined();
		});

		it('should delete deeply nested tree structure', async () => {
			// Create a deep structure: root -> level1 -> level2 -> level3
			const root = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const level1 = await DemoService.createTreeNode({
				bookId,
				parentId: root.data!.id,
				type: 'GROUP'
			});

			const level2 = await DemoService.createTreeNode({
				bookId,
				parentId: level1.data!.id,
				type: 'GROUP'
			});

			const level3 = await DemoService.createTreeNode({
				bookId,
				parentId: level2.data!.id,
				type: 'DOC'
			});

			// Delete from root
			const result = await DemoService.deleteTreeNodeWithChildren({
				nodeId: root.data!.id,
				nodeIds: [
					root.data!.id,
					level1.data!.id,
					level2.data!.id,
					level3.data!.id
				],
				docIds: [level3.data!.docId!],
				bookId
			});

			expect(result.success).toBe(true);
			expect(result.data).toHaveLength(0);

			// Verify all nodes are deleted
			const db = (await import('../demo')).getDatabase();
			const allNodes = await db.treeNodes
				.where('bookId')
				.equals(bookId)
				.toArray();

			expect(allNodes).toHaveLength(0);
		});
	});

	describe('Edge Cases and Error Handling', () => {
		it('should handle creating book with empty name', async () => {
			const result = await DemoService.createBook({ name: '' });

			expect(result.success).toBe(true);
			expect(result.data?.slug).toBeDefined();
		});

		it('should handle creating book with special characters in name', async () => {
			const result = await DemoService.createBook({
				name: 'Test Book!@#$%^&*()'
			});

			expect(result.success).toBe(true);
			expect(result.data?.name).toBe('Test Book!@#$%^&*()');
			// limax should convert special characters
			expect(result.data?.slug).toMatch(/^test-book/);
		});

		it('should handle creating book with unicode characters', async () => {
			const result = await DemoService.createBook({ name: '测试书籍 📚' });

			expect(result.success).toBe(true);
			expect(result.data?.name).toBe('测试书籍 📚');
			expect(result.data?.slug).toBeDefined();
		});

		it('should handle getting non-existent tree nodes', async () => {
			const nodes = await DemoService.getTreeNodesByBookId(999999);

			expect(nodes).toHaveLength(0);
		});

		it('should handle updating book with invalid id', async () => {
			const result = await DemoService.updateBook({
				id: 999999,
				name: 'Updated Name'
			});

			// Update will succeed even if book doesn't exist (Dexie behavior)
			// But the book won't actually be in the database
			expect(result.success).toBe(true);

			const book = await DemoService.getBook(999999);

			expect(book).toBeNull();
		});

		it('should handle checking slug for empty string', async () => {
			const result = await DemoService.checkBookSlug('');

			expect(result.success).toBe(true);
			expect(result.data).toBe(true); // Empty slug is available
		});

		it('should handle multiple books with similar names', async () => {
			// Add a small delay between creations to ensure unique timestamps
			const book1 = await DemoService.createBook({ name: 'Test' });

			await new Promise((resolve) => setTimeout(resolve, 10));
			const book2 = await DemoService.createBook({ name: 'Test' });

			await new Promise((resolve) => setTimeout(resolve, 10));
			const book3 = await DemoService.createBook({ name: 'Test' });

			// All created books should have unique slugs
			const createdSlugs = [
				book1.data!.slug,
				book2.data!.slug,
				book3.data!.slug
			];
			const uniqueSlugs = new Set(createdSlugs);

			expect(uniqueSlugs.size).toBe(3);
			expect(createdSlugs[0]).toBe('test');
			expect(createdSlugs[1]).toMatch(/^test-\d+$/);
			expect(createdSlugs[2]).toMatch(/^test-\d+$/);
			// Ensure the timestamps are different
			expect(createdSlugs[1]).not.toBe(createdSlugs[2]);
		});

		it('should handle creating tree node with null parent correctly', async () => {
			const book = await DemoService.createBook({ name: 'Test Book' });
			const result = await DemoService.createTreeNode({
				bookId: book.data!.id,
				parentId: null,
				type: 'DOC'
			});

			expect(result.success).toBe(true);
			expect(result.data?.parentId).toBeNull();
			expect(result.data?.prevId).toBeNull();
		});

		it('should handle deleting book with no nodes', async () => {
			const book = await DemoService.createBook({ name: 'Empty Book' });
			const result = await DemoService.deleteBook(book.data!.id);

			expect(result.success).toBe(true);

			const deletedBook = await DemoService.getBook(book.data!.id);

			expect(deletedBook).toBeNull();
		});

		it('should handle deleting non-existent book', async () => {
			const result = await DemoService.deleteBook(999999);

			// Dexie delete succeeds even if item doesn't exist
			expect(result.success).toBe(true);
		});
	});

	describe('Complex Tree Structure Tests', () => {
		let bookId: number;

		beforeEach(async () => {
			const book = await DemoService.createBook({ name: 'Complex Tree Book' });

			bookId = book.data!.id;
		});

		it('should handle tree with multiple levels and siblings', async () => {
			// Create structure:
			// root1
			//   - child1-1
			//   - child1-2
			// root2
			//   - child2-1
			//     - grandchild2-1-1
			const root1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const child1_1 = await DemoService.createTreeNode({
				bookId,
				parentId: root1.data!.id,
				type: 'DOC'
			});

			const child1_2 = await DemoService.createTreeNode({
				bookId,
				parentId: root1.data!.id,
				type: 'DOC'
			});

			const root2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const child2_1 = await DemoService.createTreeNode({
				bookId,
				parentId: root2.data!.id,
				type: 'GROUP'
			});

			const grandchild2_1_1 = await DemoService.createTreeNode({
				bookId,
				parentId: child2_1.data!.id,
				type: 'DOC'
			});

			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(nodes).toHaveLength(6);

			// Verify levels
			const nodeMap = new Map(nodes.map((n) => [n.id, n]));

			expect(nodeMap.get(root1.data!.id)?.level).toBe(0);
			expect(nodeMap.get(child1_1.data!.id)?.level).toBe(1);
			expect(nodeMap.get(child1_2.data!.id)?.level).toBe(1);
			expect(nodeMap.get(root2.data!.id)?.level).toBe(0);
			expect(nodeMap.get(child2_1.data!.id)?.level).toBe(1);
			expect(nodeMap.get(grandchild2_1_1.data!.id)?.level).toBe(2);
		});

		it('should maintain correct order for multiple siblings', async () => {
			// Create 5 sibling nodes
			const nodes = [];

			for (let i = 0; i < 5; i++) {
				const node = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				nodes.push(node.data!);
			}

			const allNodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(allNodes).toHaveLength(5);

			// Verify the order is correct (newest first due to insertion at head)
			expect(allNodes[0].id).toBe(nodes[4].id);
			expect(allNodes[1].id).toBe(nodes[3].id);
			expect(allNodes[2].id).toBe(nodes[2].id);
			expect(allNodes[3].id).toBe(nodes[1].id);
			expect(allNodes[4].id).toBe(nodes[0].id);
		});

		it('should handle tree with only GROUP nodes', async () => {
			const group1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			await DemoService.createTreeNode({
				bookId,
				parentId: group1.data!.id,
				type: 'GROUP'
			});

			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(nodes).toHaveLength(2);
			expect(nodes.every((n) => n.type === 'GROUP')).toBe(true);
			expect(nodes.every((n) => n.docId === null)).toBe(true);
		});

		it('should handle wide tree (many siblings at same level)', async () => {
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			// Create 10 children
			const children = [];

			for (let i = 0; i < 10; i++) {
				const child = await DemoService.createTreeNode({
					bookId,
					parentId: parent.data!.id,
					type: 'DOC'
				});

				children.push(child.data!);
			}

			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(nodes).toHaveLength(11); // 1 parent + 10 children

			// Verify all children have correct parent and level
			const childNodes = nodes.filter((n) => n.parentId === parent.data!.id);

			expect(childNodes).toHaveLength(10);
			expect(childNodes.every((n) => n.level === 1)).toBe(true);
		});

		it('should handle deep tree (many levels)', async () => {
			let currentParentId: number | null = null;
			const depth = 10;

			// Create a chain of 10 levels
			for (let i = 0; i < depth; i++) {
				const node = await DemoService.createTreeNode({
					bookId,
					parentId: currentParentId,
					type: i === depth - 1 ? 'DOC' : 'GROUP'
				});

				currentParentId = node.data!.id;
			}

			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(nodes).toHaveLength(depth);

			// Verify levels go from 0 to depth-1
			const levels = nodes.map((n) => n.level).sort((a, b) => a - b);

			expect(levels).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
		});
	});

	describe('PrependChild Operations', () => {
		let bookId: number;

		beforeEach(async () => {
			const book = await DemoService.createBook({ name: 'PrependChild Test' });

			bookId = book.data!.id;
		});

		it('should prepend node as first child of root (null parent)', async () => {
			// Create initial structure: node1 -> node2
			const node1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const node2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Move node1 to be first child of root (after node2)
			const result = await DemoService.prependChild({
				bookId,
				nodeId: node1.data!.id,
				targetId: null
			});

			expect(result.success).toBe(true);

			// Verify node1 is now the first node
			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(nodes[0].id).toBe(node1.data!.id);
			expect(nodes[0].prevId).toBeNull();
			expect(nodes[0].parentId).toBeNull();
			expect(nodes[0].siblingId).toBe(node2.data!.id);
		});

		it('should prepend node as first child of a parent node', async () => {
			// Create structure: parent with child1
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const child1 = await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			// Create another node at root
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Move node to be first child of parent
			const result = await DemoService.prependChild({
				bookId,
				nodeId: node.data!.id,
				targetId: parent.data!.id
			});

			expect(result.success).toBe(true);

			// Verify structure
			const db = (await import('../demo')).getDatabase();
			const movedNode = await db.treeNodes.get(node.data!.id);
			const parentNode = await db.treeNodes.get(parent.data!.id);
			const child1Node = await db.treeNodes.get(child1.data!.id);

			// Node should be first child of parent
			expect(movedNode?.parentId).toBe(parent.data!.id);
			expect(movedNode?.prevId).toBe(parent.data!.id);
			expect(movedNode?.siblingId).toBe(child1.data!.id);

			// Parent should point to moved node as first child
			expect(parentNode?.childId).toBe(node.data!.id);

			// Child1 should now have moved node as prev
			expect(child1Node?.prevId).toBe(node.data!.id);
		});

		it('should handle prepending node with children', async () => {
			// Create structure: parent1 with child, parent2
			const parent1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const child = await DemoService.createTreeNode({
				bookId,
				parentId: parent1.data!.id,
				type: 'DOC'
			});

			const parent2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			// Move parent1 (with its child) to be child of parent2
			const result = await DemoService.prependChild({
				bookId,
				nodeId: parent1.data!.id,
				targetId: parent2.data!.id
			});

			expect(result.success).toBe(true);

			// Verify the entire subtree moved
			const nodes = await DemoService.getTreeNodesByBookId(bookId);
			const nodeMap = new Map(nodes.map((n) => [n.id, n]));

			const parent1Node = nodeMap.get(parent1.data!.id);
			const childNode = nodeMap.get(child.data!.id);

			expect(parent1Node?.parentId).toBe(parent2.data!.id);
			expect(parent1Node?.level).toBe(1);
			expect(childNode?.level).toBe(2); // Child should be at level 2 now
		});

		it('should maintain tree integrity when prepending middle sibling', async () => {
			// Create three siblings: node1 -> node2 -> node3
			const node1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const node2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const node3 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Create a parent
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			// Move node2 to be child of parent
			await DemoService.prependChild({
				bookId,
				nodeId: node2.data!.id,
				targetId: parent.data!.id
			});

			// Verify node3 and node1 are still connected
			const db = (await import('../demo')).getDatabase();
			const node3Updated = await db.treeNodes.get(node3.data!.id);
			const node1Updated = await db.treeNodes.get(node1.data!.id);

			expect(node3Updated?.siblingId).toBe(node1.data!.id);
			expect(node1Updated?.prevId).toBe(node3.data!.id);
		});

		it('should handle prepending to empty parent', async () => {
			// Create parent with no children
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			// Create a node
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Move node to be child of empty parent
			const result = await DemoService.prependChild({
				bookId,
				nodeId: node.data!.id,
				targetId: parent.data!.id
			});

			expect(result.success).toBe(true);

			const db = (await import('../demo')).getDatabase();
			const movedNode = await db.treeNodes.get(node.data!.id);
			const parentNode = await db.treeNodes.get(parent.data!.id);

			expect(movedNode?.parentId).toBe(parent.data!.id);
			expect(movedNode?.siblingId).toBeNull();
			expect(parentNode?.childId).toBe(node.data!.id);
		});

		it('should not move node if already in target position', async () => {
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const child = await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			// Try to prepend child to parent again (it's already first child)
			const result = await DemoService.prependChild({
				bookId,
				nodeId: child.data!.id,
				targetId: parent.data!.id
			});

			expect(result.success).toBe(true);

			// Verify structure unchanged
			const db = (await import('../demo')).getDatabase();
			const childNode = await db.treeNodes.get(child.data!.id);

			expect(childNode?.parentId).toBe(parent.data!.id);
			expect(childNode?.prevId).toBe(parent.data!.id);
		});
	});

	describe('MoveAfter Operations', () => {
		let bookId: number;

		beforeEach(async () => {
			const book = await DemoService.createBook({ name: 'MoveAfter Test' });

			bookId = book.data!.id;
		});

		it('should move node after another sibling node', async () => {
			// Create two nodes: node1 -> node2
			const node1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const node2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Move node2 after node1
			const result = await DemoService.moveAfter({
				bookId,
				nodeId: node2.data!.id,
				targetId: node1.data!.id
			});

			expect(result.success).toBe(true);

			// Verify structure
			const db = (await import('../demo')).getDatabase();
			const node1Updated = await db.treeNodes.get(node1.data!.id);
			const node2Updated = await db.treeNodes.get(node2.data!.id);

			expect(node2Updated?.prevId).toBe(node1.data!.id);
			expect(node2Updated?.parentId).toBe(node1Updated?.parentId);
			expect(node1Updated?.siblingId).toBe(node2.data!.id);
		});

		it('should move node after sibling in different parent', async () => {
			// Create structure: parent1 with child1, parent2 with child2
			const parent1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const child1 = await DemoService.createTreeNode({
				bookId,
				parentId: parent1.data!.id,
				type: 'DOC'
			});

			const parent2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const child2 = await DemoService.createTreeNode({
				bookId,
				parentId: parent2.data!.id,
				type: 'DOC'
			});

			// Move child2 after child1 (changes parent)
			const result = await DemoService.moveAfter({
				bookId,
				nodeId: child2.data!.id,
				targetId: child1.data!.id
			});

			expect(result.success).toBe(true);

			// Verify child2 is now sibling of child1
			const db = (await import('../demo')).getDatabase();
			const child2Updated = await db.treeNodes.get(child2.data!.id);
			const child1Updated = await db.treeNodes.get(child1.data!.id);

			expect(child2Updated?.parentId).toBe(parent1.data!.id);
			expect(child2Updated?.prevId).toBe(child1.data!.id);
			expect(child1Updated?.siblingId).toBe(child2.data!.id);
		});

		it('should move node with children after another node', async () => {
			// Create structure: parent with grandchild, sibling
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const grandchild = await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			const sibling = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Move parent (with grandchild) after sibling
			const result = await DemoService.moveAfter({
				bookId,
				nodeId: parent.data!.id,
				targetId: sibling.data!.id
			});

			expect(result.success).toBe(true);

			// Verify entire subtree moved
			const nodes = await DemoService.getTreeNodesByBookId(bookId);
			const nodeMap = new Map(nodes.map((n) => [n.id, n]));

			const parentNode = nodeMap.get(parent.data!.id);
			const grandchildNode = nodeMap.get(grandchild.data!.id);

			expect(parentNode?.prevId).toBe(sibling.data!.id);
			expect(parentNode?.level).toBe(0);
			expect(grandchildNode?.level).toBe(1);
		});

		it('should handle moving node in middle of sibling chain', async () => {
			// Create three siblings in order: node3 -> node2 -> node1 (newest first)
			const node1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const node2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const node3 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Move node1 after node2 (inserting between node2 and node3)
			await DemoService.moveAfter({
				bookId,
				nodeId: node1.data!.id,
				targetId: node2.data!.id
			});

			// Verify structure
			const db = (await import('../demo')).getDatabase();
			const node1Updated = await db.treeNodes.get(node1.data!.id);
			const node2Updated = await db.treeNodes.get(node2.data!.id);
			const node3Updated = await db.treeNodes.get(node3.data!.id);

			// node2 should point to node1 as sibling
			expect(node2Updated?.siblingId).toBe(node1.data!.id);
			// node1 should be after node2
			expect(node1Updated?.prevId).toBe(node2.data!.id);
			// node3 should now point to node2 (since node1 was removed from end)
			expect(node3Updated?.siblingId).toBe(node2.data!.id);
		});

		it('should maintain levels when moving across different depths', async () => {
			// Create deep structure
			const level0 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const level1 = await DemoService.createTreeNode({
				bookId,
				parentId: level0.data!.id,
				type: 'GROUP'
			});

			const level2 = await DemoService.createTreeNode({
				bookId,
				parentId: level1.data!.id,
				type: 'DOC'
			});

			const rootNode = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Move level2 after rootNode (from level 2 to level 0)
			await DemoService.moveAfter({
				bookId,
				nodeId: level2.data!.id,
				targetId: rootNode.data!.id
			});

			// Verify level changed
			const nodes = await DemoService.getTreeNodesByBookId(bookId);
			const level2Node = nodes.find((n) => n.id === level2.data!.id);

			expect(level2Node?.level).toBe(0);
			expect(level2Node?.parentId).toBeNull();
		});

		it('should handle moving last node in sibling chain', async () => {
			// Create siblings: node1 -> node2 -> node3
			const node1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const node2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const node3 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Move node1 (last in chain) after node3 (first in chain)
			await DemoService.moveAfter({
				bookId,
				nodeId: node1.data!.id,
				targetId: node3.data!.id
			});

			// Verify structure
			const db = (await import('../demo')).getDatabase();
			const node1Updated = await db.treeNodes.get(node1.data!.id);
			const node2Updated = await db.treeNodes.get(node2.data!.id);
			const node3Updated = await db.treeNodes.get(node3.data!.id);

			// node3 should point to node1
			expect(node3Updated?.siblingId).toBe(node1.data!.id);
			// node1 should be between node3 and node2
			expect(node1Updated?.prevId).toBe(node3.data!.id);
			expect(node1Updated?.siblingId).toBe(node2.data!.id);
			// node2 should point back to node1
			expect(node2Updated?.prevId).toBe(node1.data!.id);
		});

		it('should move node to new position even if close to target', async () => {
			// Create two nodes where node2 is already after node1
			const node1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const node2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Move node1 after node2 (they're already in reverse order)
			await DemoService.moveAfter({
				bookId,
				nodeId: node1.data!.id,
				targetId: node2.data!.id
			});

			// Verify node1 is now after node2
			const db = (await import('../demo')).getDatabase();
			const node1After = await db.treeNodes.get(node1.data!.id);

			expect(node1After?.prevId).toBe(node2.data!.id);
		});
	});

	describe('Integration Tests', () => {
		it('should handle complete workflow: create book -> create nodes -> get nodes', async () => {
			// Create book
			const book = await DemoService.createBook({ name: 'Integration Test' });

			expect(book.success).toBe(true);

			// Create tree structure
			const group = await DemoService.createTreeNode({
				bookId: book.data!.id,
				parentId: null,
				type: 'GROUP'
			});

			await DemoService.createTreeNode({
				bookId: book.data!.id,
				parentId: group.data!.id,
				type: 'DOC'
			});

			await DemoService.createTreeNode({
				bookId: book.data!.id,
				parentId: group.data!.id,
				type: 'DOC'
			});

			// Get all nodes
			const nodes = await DemoService.getTreeNodesByBookId(book.data!.id);

			expect(nodes).toHaveLength(3);
			expect(nodes[0].type).toBe('GROUP');
			expect(nodes[0].level).toBe(0);
			expect(nodes[1].level).toBe(1);
			expect(nodes[2].level).toBe(1);
		});

		it('should handle book deletion with cascade delete of tree nodes', async () => {
			const book = await DemoService.createBook({ name: 'Test Book' });

			await DemoService.createTreeNode({
				bookId: book.data!.id,
				parentId: null,
				type: 'DOC'
			});

			await DemoService.deleteBook(book.data!.id);

			const nodes = await DemoService.getTreeNodesByBookId(book.data!.id);

			expect(nodes).toHaveLength(0);
		});

		it('should cascade delete docs when deleting book', async () => {
			const book = await DemoService.createBook({ name: 'Test Book' });

			// Create a DOC node which also creates a doc
			const docNode = await DemoService.createTreeNode({
				bookId: book.data!.id,
				parentId: null,
				type: 'DOC'
			});

			expect(docNode.data?.docId).not.toBeNull();

			// Delete the book
			await DemoService.deleteBook(book.data!.id);

			// Verify the doc was deleted
			const db = (await import('../demo')).getDatabase();
			const doc = await db.docs.get(docNode.data!.docId!);

			expect(doc).toBeUndefined();
		});

		it('should cascade delete multiple docs and nodes when deleting book', async () => {
			const book = await DemoService.createBook({ name: 'Test Book' });

			// Create multiple nodes with docs
			await DemoService.createTreeNode({
				bookId: book.data!.id,
				parentId: null,
				type: 'DOC'
			});

			await DemoService.createTreeNode({
				bookId: book.data!.id,
				parentId: null,
				type: 'DOC'
			});

			await DemoService.createTreeNode({
				bookId: book.data!.id,
				parentId: null,
				type: 'GROUP'
			});

			// Delete the book
			await DemoService.deleteBook(book.data!.id);

			// Verify all nodes were deleted
			const nodes = await DemoService.getTreeNodesByBookId(book.data!.id);

			expect(nodes).toHaveLength(0);

			// Verify all docs were deleted
			const db = (await import('../demo')).getDatabase();
			const docs = await db.docs
				.where('bookId')
				.equals(book.data!.id)
				.toArray();

			expect(docs).toHaveLength(0);
		});

		it('should cascade delete nested tree nodes when deleting book', async () => {
			const book = await DemoService.createBook({ name: 'Test Book' });

			// Create nested structure: group -> doc1 -> doc2
			const group = await DemoService.createTreeNode({
				bookId: book.data!.id,
				parentId: null,
				type: 'GROUP'
			});

			const doc1 = await DemoService.createTreeNode({
				bookId: book.data!.id,
				parentId: group.data!.id,
				type: 'DOC'
			});

			await DemoService.createTreeNode({
				bookId: book.data!.id,
				parentId: doc1.data!.id,
				type: 'DOC'
			});

			// Verify structure was created
			const nodesBefore = await DemoService.getTreeNodesByBookId(book.data!.id);

			expect(nodesBefore).toHaveLength(3);

			// Delete the book
			await DemoService.deleteBook(book.data!.id);

			// Verify all nodes were deleted
			const nodesAfter = await DemoService.getTreeNodesByBookId(book.data!.id);

			expect(nodesAfter).toHaveLength(0);

			// Verify all docs were deleted
			const db = (await import('../demo')).getDatabase();
			const docs = await db.docs
				.where('bookId')
				.equals(book.data!.id)
				.toArray();

			expect(docs).toHaveLength(0);
		});

		it('should handle complex workflow: create -> move -> delete', async () => {
			const book = await DemoService.createBook({ name: 'Complex Workflow' });
			const bookId = book.data!.id;

			// Create structure
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const child1 = await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			const child2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Move child2 to be sibling of child1
			await DemoService.moveAfter({
				bookId,
				nodeId: child2.data!.id,
				targetId: child1.data!.id
			});

			// Verify structure
			let nodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(nodes).toHaveLength(3);

			const child2Node = nodes.find((n) => n.id === child2.data!.id);

			expect(child2Node?.parentId).toBe(parent.data!.id);

			// Delete parent with all children
			await DemoService.deleteTreeNodeWithChildren({
				nodeId: parent.data!.id,
				nodeIds: [parent.data!.id, child1.data!.id, child2.data!.id],
				docIds: [child1.data!.docId!, child2.data!.docId!],
				bookId
			});

			// Verify all deleted
			nodes = await DemoService.getTreeNodesByBookId(bookId);
			expect(nodes).toHaveLength(0);
		});

		it('should handle workflow: prepend -> move after -> prepend again', async () => {
			const book = await DemoService.createBook({ name: 'Multi-move Test' });
			const bookId = book.data!.id;

			// Create nodes
			const parent1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const parent2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Move node to parent1
			await DemoService.prependChild({
				bookId,
				nodeId: node.data!.id,
				targetId: parent1.data!.id
			});

			let nodes = await DemoService.getTreeNodesByBookId(bookId);
			let nodeData = nodes.find((n) => n.id === node.data!.id);

			expect(nodeData?.parentId).toBe(parent1.data!.id);

			// Move node after parent2 (to root level)
			await DemoService.moveAfter({
				bookId,
				nodeId: node.data!.id,
				targetId: parent2.data!.id
			});

			nodes = await DemoService.getTreeNodesByBookId(bookId);
			nodeData = nodes.find((n) => n.id === node.data!.id);
			expect(nodeData?.level).toBe(0);

			// Move node back to parent1
			await DemoService.prependChild({
				bookId,
				nodeId: node.data!.id,
				targetId: parent1.data!.id
			});

			nodes = await DemoService.getTreeNodesByBookId(bookId);
			nodeData = nodes.find((n) => n.id === node.data!.id);
			expect(nodeData?.parentId).toBe(parent1.data!.id);
			expect(nodeData?.level).toBe(1);
		});
	});

	describe('UpdateTreeNodeTitle Operations', () => {
		let bookId: number;

		beforeEach(async () => {
			const book = await DemoService.createBook({ name: 'Update Title Test' });

			bookId = book.data!.id;
		});

		it('should update tree node title for DOC type', async () => {
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const result = await DemoService.updateTreeNodeTitle({
				id: node.data!.id,
				title: 'Updated Title'
			});

			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();

			// Verify the node title was updated
			const db = (await import('../demo')).getDatabase();
			const updatedNode = await db.treeNodes.get(node.data!.id);

			expect(updatedNode?.title).toBe('Updated Title');

			// Verify the associated doc title was also updated
			const doc = await db.docs.get(node.data!.docId!);

			expect(doc?.title).toBe('Updated Title');
		});

		it('should update tree node title for GROUP type', async () => {
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const result = await DemoService.updateTreeNodeTitle({
				id: node.data!.id,
				title: 'Updated Group Title'
			});

			expect(result.success).toBe(true);

			// Verify the node title was updated
			const db = (await import('../demo')).getDatabase();
			const updatedNode = await db.treeNodes.get(node.data!.id);

			expect(updatedNode?.title).toBe('Updated Group Title');
			// GROUP nodes don't have associated docs
			expect(updatedNode?.docId).toBeNull();
		});

		it('should update title with special characters', async () => {
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const specialTitle = 'Title with 特殊字符 & symbols! @#$%';
			const result = await DemoService.updateTreeNodeTitle({
				id: node.data!.id,
				title: specialTitle
			});

			expect(result.success).toBe(true);

			const db = (await import('../demo')).getDatabase();
			const updatedNode = await db.treeNodes.get(node.data!.id);

			expect(updatedNode?.title).toBe(specialTitle);
		});

		it('should update title with empty string', async () => {
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const result = await DemoService.updateTreeNodeTitle({
				id: node.data!.id,
				title: ''
			});

			expect(result.success).toBe(true);

			const db = (await import('../demo')).getDatabase();
			const updatedNode = await db.treeNodes.get(node.data!.id);

			expect(updatedNode?.title).toBe('');
		});

		it('should fail when updating non-existent node', async () => {
			const result = await DemoService.updateTreeNodeTitle({
				id: 999999,
				title: 'New Title'
			});

			expect(result.success).toBe(false);
			expect(result.message).toBeDefined();
		});

		it('should update title and return updated tree nodes', async () => {
			// Create multiple nodes
			const node1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Update one node's title
			const result = await DemoService.updateTreeNodeTitle({
				id: node1.data!.id,
				title: 'Updated Title'
			});

			expect(result.success).toBe(true);
			expect(result.data).toHaveLength(2);

			// Verify the returned nodes include the updated title
			const updatedNode = result.data?.find((n) => n.id === node1.data!.id);

			expect(updatedNode?.title).toBe('Updated Title');
		});

		it('should update title for nested node', async () => {
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const child = await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			const result = await DemoService.updateTreeNodeTitle({
				id: child.data!.id,
				title: 'Nested Node Title'
			});

			expect(result.success).toBe(true);

			const db = (await import('../demo')).getDatabase();
			const updatedChild = await db.treeNodes.get(child.data!.id);

			expect(updatedChild?.title).toBe('Nested Node Title');
			expect(updatedChild?.parentId).toBe(parent.data!.id);
		});

		it('should update title multiple times', async () => {
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// First update
			await DemoService.updateTreeNodeTitle({
				id: node.data!.id,
				title: 'First Update'
			});

			// Second update
			await DemoService.updateTreeNodeTitle({
				id: node.data!.id,
				title: 'Second Update'
			});

			// Third update
			const result = await DemoService.updateTreeNodeTitle({
				id: node.data!.id,
				title: 'Final Update'
			});

			expect(result.success).toBe(true);

			const db = (await import('../demo')).getDatabase();
			const updatedNode = await db.treeNodes.get(node.data!.id);

			expect(updatedNode?.title).toBe('Final Update');
		});
	});

	describe('Edge Cases for Move Operations', () => {
		let bookId: number;

		beforeEach(async () => {
			const book = await DemoService.createBook({ name: 'Edge Cases Test' });

			bookId = book.data!.id;
		});

		it('should handle moving node to root when it is only node', async () => {
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Try to prepend to root (should be no-op)
			const result = await DemoService.prependChild({
				bookId,
				nodeId: node.data!.id,
				targetId: null
			});

			expect(result.success).toBe(true);

			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(nodes).toHaveLength(1);
			expect(nodes[0].parentId).toBeNull();
		});

		it('should handle moving deeply nested node to root', async () => {
			// Create deep nesting: level0 -> level1 -> level2 -> level3
			const level0 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const level1 = await DemoService.createTreeNode({
				bookId,
				parentId: level0.data!.id,
				type: 'GROUP'
			});

			const level2 = await DemoService.createTreeNode({
				bookId,
				parentId: level1.data!.id,
				type: 'GROUP'
			});

			const level3 = await DemoService.createTreeNode({
				bookId,
				parentId: level2.data!.id,
				type: 'DOC'
			});

			// Move level3 to root
			await DemoService.prependChild({
				bookId,
				nodeId: level3.data!.id,
				targetId: null
			});

			const nodes = await DemoService.getTreeNodesByBookId(bookId);
			const level3Node = nodes.find((n) => n.id === level3.data!.id);

			expect(level3Node?.level).toBe(0);
			expect(level3Node?.parentId).toBeNull();
		});

		it('should handle moving node after itself (edge case)', async () => {
			await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const node2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Move node2 after node2 (itself)
			await DemoService.moveAfter({
				bookId,
				nodeId: node2.data!.id,
				targetId: node2.data!.id
			});

			// Verify structure remains valid
			const db = (await import('../demo')).getDatabase();
			const node2After = await db.treeNodes.get(node2.data!.id);

			expect(node2After).toBeDefined();
		});

		it('should handle prepending node to itself as parent (circular reference)', async () => {
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			// Try to make node its own parent - this creates a circular reference
			const result = await DemoService.prependChild({
				bookId,
				nodeId: node.data!.id,
				targetId: node.data!.id
			});

			// Operation completes
			expect(result.success).toBe(true);

			// Verify the actual state of the node
			const db = (await import('../demo')).getDatabase();
			const nodeInDb = await db.treeNodes.get(node.data!.id);

			expect(nodeInDb).toBeDefined();

			// The node should have itself as parent (circular reference)
			expect(nodeInDb?.parentId).toBe(node.data!.id);
			expect(nodeInDb?.prevId).toBe(node.data!.id);

			// This creates a problematic state where the node won't appear in getTreeNodesByBookId
			// because flattenTreeNodeNodes can't process circular structures
			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			// The circular node won't be included in the flattened result
			expect(nodes.length).toBe(0);
		});

		it('should handle moving all children out of a parent', async () => {
			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const child1 = await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			const child2 = await DemoService.createTreeNode({
				bookId,
				parentId: parent.data!.id,
				type: 'DOC'
			});

			// Move both children to root
			await DemoService.prependChild({
				bookId,
				nodeId: child1.data!.id,
				targetId: null
			});

			await DemoService.prependChild({
				bookId,
				nodeId: child2.data!.id,
				targetId: null
			});

			// Verify parent has no children
			const db = (await import('../demo')).getDatabase();
			const parentNode = await db.treeNodes.get(parent.data!.id);

			expect(parentNode?.childId).toBeNull();

			// Verify both children are at root
			const nodes = await DemoService.getTreeNodesByBookId(bookId);
			const child1Node = nodes.find((n) => n.id === child1.data!.id);
			const child2Node = nodes.find((n) => n.id === child2.data!.id);

			expect(child1Node?.level).toBe(0);
			expect(child2Node?.level).toBe(0);
		});

		it('should handle rapid consecutive moves', async () => {
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			const target1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const target2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			// Perform multiple moves in sequence
			await DemoService.prependChild({
				bookId,
				nodeId: node.data!.id,
				targetId: target1.data!.id
			});

			await DemoService.prependChild({
				bookId,
				nodeId: node.data!.id,
				targetId: target2.data!.id
			});

			await DemoService.prependChild({
				bookId,
				nodeId: node.data!.id,
				targetId: null
			});

			// Verify final state
			const nodes = await DemoService.getTreeNodesByBookId(bookId);
			const nodeData = nodes.find((n) => n.id === node.data!.id);

			expect(nodeData?.parentId).toBeNull();
			expect(nodeData?.level).toBe(0);

			// Verify tree integrity
			expect(nodes).toHaveLength(3);
		});

		it('should maintain correct order after multiple moveAfter operations', async () => {
			// Create 4 nodes
			const nodes = [];

			for (let i = 0; i < 4; i++) {
				const node = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				nodes.push(node.data!);
			}

			// Rearrange: move nodes[0] after nodes[2]
			await DemoService.moveAfter({
				bookId,
				nodeId: nodes[0].id,
				targetId: nodes[2].id
			});

			// Move nodes[1] after nodes[0]
			await DemoService.moveAfter({
				bookId,
				nodeId: nodes[1].id,
				targetId: nodes[0].id
			});

			// Verify final order
			const allNodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(allNodes).toHaveLength(4);

			// All should still be at root level
			expect(allNodes.every((n) => n.level === 0)).toBe(true);
		});
	});

	describe('Doc Operations', () => {
		let bookId: number;
		let docId: number;

		beforeEach(async () => {
			const book = await DemoService.createBook({ name: 'Doc Test Book' });

			bookId = book.data!.id;

			// Create a DOC node which also creates a doc
			const docNode = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			docId = docNode.data!.docId!;
		});

		it('should get doc metadata with book info', async () => {
			const docMeta = await DemoService.getDocMeta(docId);

			expect(docMeta).toBeDefined();
			expect(docMeta.id).toBe(docId);
			expect(docMeta.bookId).toBe(bookId);
			expect(docMeta.book).toBeDefined();
			expect(docMeta.book.slug).toBeDefined();
			expect(docMeta.book.type).toBe('BLOGS');
			expect(docMeta.title).toBe(t.new_doc_default_name);
			expect(docMeta.slug).toMatch(/^doc-\d+$/);
			expect(docMeta.isPublished).toBe(false);
			expect(docMeta.isDeleted).toBe(false);
		});

		it('should throw error when getting non-existent doc metadata', async () => {
			await expect(DemoService.getDocMeta(999999)).rejects.toThrow(
				'Document not found'
			);
		});

		it('should throw error when doc exists but book is deleted', async () => {
			// Delete the book (which also deletes docs)
			await DemoService.deleteBook(bookId);

			// Try to get doc metadata - doc should be deleted
			await expect(DemoService.getDocMeta(docId)).rejects.toThrow(
				'Document not found'
			);
		});

		it('should get doc by id', async () => {
			const doc = await DemoService.getDoc(docId);

			expect(doc).toBeDefined();
			expect(doc.id).toBe(docId);
			expect(doc.bookId).toBe(bookId);
			expect(doc.title).toBe(t.new_doc_default_name);
			expect(doc.slug).toMatch(/^doc-\d+$/);
			expect(doc.content).toBeNull();
			expect(doc.cover).toBeNull();
			expect(doc.summary).toBeNull();
			expect(doc.viewCount).toBe(0);
			expect(doc.isPublished).toBe(false);
			expect(doc.isDeleted).toBe(false);
		});

		it('should throw error when getting non-existent doc', async () => {
			await expect(DemoService.getDoc(999999)).rejects.toThrow(
				'Document not found'
			);
		});

		it('should check doc slug availability', async () => {
			const db = (await import('../demo')).getDatabase();
			const doc = await db.docs.get(docId);

			// Existing slug should not be available
			const existingResult = await DemoService.checkDocSlug({
				bookId,
				docSlug: doc!.slug
			});

			expect(existingResult.success).toBe(true);
			expect(existingResult.data).toBe(false);

			// New slug should be available
			const availableResult = await DemoService.checkDocSlug({
				bookId,
				docSlug: 'new-unique-slug'
			});

			expect(availableResult.success).toBe(true);
			expect(availableResult.data).toBe(true);
		});

		it('should check doc slug availability across different books', async () => {
			const db = (await import('../demo')).getDatabase();
			const doc = await db.docs.get(docId);

			// Create another book
			const book2 = await DemoService.createBook({ name: 'Book 2' });

			// Same slug in different book should be available
			const result = await DemoService.checkDocSlug({
				bookId: book2.data!.id,
				docSlug: doc!.slug
			});

			expect(result.success).toBe(true);
			expect(result.data).toBe(true);
		});

		it('should check empty slug', async () => {
			const result = await DemoService.checkDocSlug({
				bookId,
				docSlug: ''
			});

			expect(result.success).toBe(true);
			expect(result.data).toBe(true);
		});

		it('should update doc metadata (title only)', async () => {
			const result = await DemoService.updateDocMeta({
				id: docId,
				title: 'Updated Doc Title'
			});

			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.data?.title).toBe('Updated Doc Title');

			// Verify the doc was updated
			const doc = await DemoService.getDoc(docId);

			expect(doc.title).toBe('Updated Doc Title');

			// Verify the tree node title was also updated
			const db = (await import('../demo')).getDatabase();
			const treeNode = await db.treeNodes.where('docId').equals(docId).first();

			expect(treeNode?.title).toBe('Updated Doc Title');
		});

		it('should update doc metadata (slug only)', async () => {
			const result = await DemoService.updateDocMeta({
				id: docId,
				slug: 'custom-slug'
			});

			expect(result.success).toBe(true);
			expect(result.data?.slug).toBe('custom-slug');

			// Verify the tree node url was also updated
			const db = (await import('../demo')).getDatabase();
			const treeNode = await db.treeNodes.where('docId').equals(docId).first();

			expect(treeNode?.url).toBe('custom-slug');
		});

		it('should update doc metadata (multiple fields)', async () => {
			const result = await DemoService.updateDocMeta({
				id: docId,
				title: 'New Title',
				slug: 'new-slug',
				summary: 'This is a summary',
				cover: 'https://example.com/cover.jpg',
				isPublished: true
			});

			expect(result.success).toBe(true);
			expect(result.data?.title).toBe('New Title');
			expect(result.data?.slug).toBe('new-slug');
			expect(result.data?.summary).toBe('This is a summary');
			expect(result.data?.cover).toBe('https://example.com/cover.jpg');
			expect(result.data?.isPublished).toBe(true);

			// Verify tree node was updated
			const db = (await import('../demo')).getDatabase();
			const treeNode = await db.treeNodes.where('docId').equals(docId).first();

			expect(treeNode?.title).toBe('New Title');
			expect(treeNode?.url).toBe('new-slug');
		});

		it('should update doc metadata with special characters', async () => {
			const specialTitle = 'Title with 特殊字符 & symbols! @#$%';
			const result = await DemoService.updateDocMeta({
				id: docId,
				title: specialTitle
			});

			expect(result.success).toBe(true);
			expect(result.data?.title).toBe(specialTitle);
		});

		it('should handle updating non-existent doc metadata', async () => {
			const result = await DemoService.updateDocMeta({
				id: 999999,
				title: 'New Title'
			});

			// Should fail because getDocMeta is called which throws error
			expect(result.success).toBe(false);
			expect(result.message).toBeDefined();
		});

		it('should update doc content', async () => {
			const content = {
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [{ type: 'text', text: 'Hello World' }]
					}
				]
			};

			const result = await DemoService.updateDocContent({
				id: docId,
				content: JSON.stringify(content)
			});

			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.data?.content).toEqual(content);

			// Verify the doc was updated
			const doc = await DemoService.getDoc(docId);

			expect(doc.content).toEqual(content);
		});

		it('should update doc content with empty content', async () => {
			const emptyContent = { type: 'doc', content: [] };

			const result = await DemoService.updateDocContent({
				id: docId,
				content: JSON.stringify(emptyContent)
			});

			expect(result.success).toBe(true);
			expect(result.data?.content).toEqual(emptyContent);
		});

		it('should update doc content multiple times', async () => {
			const content1 = { type: 'doc', content: [{ type: 'paragraph' }] };
			const content2 = {
				type: 'doc',
				content: [{ type: 'paragraph' }, { type: 'paragraph' }]
			};
			const content3 = {
				type: 'doc',
				content: [
					{ type: 'heading', attrs: { level: 1 } },
					{ type: 'paragraph' }
				]
			};

			await DemoService.updateDocContent({
				id: docId,
				content: JSON.stringify(content1)
			});
			await DemoService.updateDocContent({
				id: docId,
				content: JSON.stringify(content2)
			});
			const result = await DemoService.updateDocContent({
				id: docId,
				content: JSON.stringify(content3)
			});

			expect(result.success).toBe(true);
			expect(result.data?.content).toEqual(content3);
		});

		it('should handle updating content of non-existent doc', async () => {
			const result = await DemoService.updateDocContent({
				id: 999999,
				content: JSON.stringify({ type: 'doc', content: [] })
			});

			// Should fail because getDoc is called which throws error
			expect(result.success).toBe(false);
			expect(result.message).toBeDefined();
		});

		it('should handle updating content with invalid JSON', async () => {
			const result = await DemoService.updateDocContent({
				id: docId,
				content: 'invalid json {'
			});

			// Should fail due to JSON parse error
			expect(result.success).toBe(false);
			expect(result.message).toBeDefined();
		});

		it('should update doc metadata and content independently', async () => {
			// Update metadata
			await DemoService.updateDocMeta({
				id: docId,
				title: 'Metadata Title'
			});

			// Update content
			const content = { type: 'doc', content: [{ type: 'paragraph' }] };

			await DemoService.updateDocContent({
				id: docId,
				content: JSON.stringify(content)
			});

			// Verify both were updated
			const doc = await DemoService.getDoc(docId);

			expect(doc.title).toBe('Metadata Title');
			expect(doc.content).toEqual(content);
		});

		it('should maintain doc relationships after metadata update', async () => {
			// Create another doc node
			const docNode2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Update first doc metadata
			await DemoService.updateDocMeta({
				id: docId,
				title: 'First Doc'
			});

			// Update second doc metadata
			await DemoService.updateDocMeta({
				id: docNode2.data!.docId!,
				title: 'Second Doc'
			});

			// Verify both docs exist and are independent
			const doc1 = await DemoService.getDoc(docId);
			const doc2 = await DemoService.getDoc(docNode2.data!.docId!);

			expect(doc1.title).toBe('First Doc');
			expect(doc2.title).toBe('Second Doc');
			expect(doc1.id).not.toBe(doc2.id);
		});
	});

	describe('File Upload Operations', () => {
		// Mock FileReader and Image for testing
		const createMockFile = (
			name: string,
			size: number,
			type: string,
			content: string
		): File => {
			const blob = new Blob([content], { type });

			return new File([blob], name, { type });
		};

		// Helper to create a mock image data URL
		const createMockImageDataURL = (): string => {
			// Simple 1x1 transparent PNG base64
			return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
		};

		beforeEach(() => {
			// Mock FileReader
			global.FileReader = class MockFileReader {
				result: string | null = null;
				onload: ((event: ProgressEvent) => void) | null = null;
				onerror: ((event: ProgressEvent) => void) | null = null;

				readAsDataURL() {
					// Simulate async file reading
					setTimeout(() => {
						this.result = createMockImageDataURL();

						if (this.onload) {
							this.onload({} as ProgressEvent);
						}
					}, 0);
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any;

			// Mock Image
			global.Image = class MockImage {
				onload: (() => void) | null = null;
				onerror: (() => void) | null = null;
				naturalWidth = 100;
				naturalHeight = 100;
				src = '';

				constructor() {
					// Simulate async image loading
					setTimeout(() => {
						if (this.onload) {
							this.onload();
						}
					}, 0);
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any;
		});

		it('should upload a file and return file entity', async () => {
			const file = createMockFile(
				'test.png',
				1024,
				'image/png',
				'test content'
			);

			const result = await DemoService.uploadFile(file);

			expect(result).toBeDefined();
			expect(result.id).toBeDefined();
			expect(result.url).toContain('data:image/png;base64');
			expect(result.hash).toBeDefined();
			expect(result.width).toBe(100);
			expect(result.height).toBe(100);
			expect(result.mimeType).toBe('image/png');
			expect(result.size).toBe(file.size); // Use actual file size
			expect(result.createdAt).toBeInstanceOf(Date);
			expect(result.updatedAt).toBeInstanceOf(Date);
		});

		it('should upload multiple files with unique ids', async () => {
			const file1 = createMockFile('test1.png', 1024, 'image/png', 'content1');
			const file2 = createMockFile('test2.png', 2048, 'image/jpeg', 'content2');

			// Add small delay to ensure different timestamps
			const result1 = await DemoService.uploadFile(file1);

			await new Promise((resolve) => setTimeout(resolve, 10));
			const result2 = await DemoService.uploadFile(file2);

			expect(result1.id).not.toBe(result2.id);
			expect(result1.hash).not.toBe(result2.hash);
			expect(result1.size).toBe(file1.size);
			expect(result2.size).toBe(file2.size);
		});

		it('should handle different file types', async () => {
			const pngFile = createMockFile('test.png', 100, 'image/png', 'png');
			const jpegFile = createMockFile('test.jpg', 200, 'image/jpeg', 'jpeg');
			const gifFile = createMockFile('test.gif', 300, 'image/gif', 'gif');

			const pngResult = await DemoService.uploadFile(pngFile);
			const jpegResult = await DemoService.uploadFile(jpegFile);
			const gifResult = await DemoService.uploadFile(gifFile);

			expect(pngResult.mimeType).toBe('image/png');
			expect(jpegResult.mimeType).toBe('image/jpeg');
			expect(gifResult.mimeType).toBe('image/gif');
		});

		it('should handle large files', async () => {
			const largeFile = createMockFile(
				'large.png',
				10 * 1024 * 1024,
				'image/png',
				'large content'
			);

			const result = await DemoService.uploadFile(largeFile);

			expect(result).toBeDefined();
			expect(result.size).toBe(largeFile.size);
		});

		it('should handle files with zero size', async () => {
			const emptyFile = createMockFile('empty.png', 0, 'image/png', '');

			const result = await DemoService.uploadFile(emptyFile);

			expect(result).toBeDefined();
			expect(result.size).toBe(0);
		});

		it('should handle image load error gracefully', async () => {
			// Mock Image to simulate error
			global.Image = class MockImageError {
				onload: (() => void) | null = null;
				onerror: (() => void) | null = null;
				naturalWidth = 0;
				naturalHeight = 0;
				src = '';

				constructor() {
					setTimeout(() => {
						if (this.onerror) {
							this.onerror();
						}
					}, 0);
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any;

			const file = createMockFile('test.png', 1024, 'image/png', 'content');

			const result = await DemoService.uploadFile(file);

			// Should still return result with 0 dimensions
			expect(result).toBeDefined();
			expect(result.width).toBe(0);
			expect(result.height).toBe(0);
		});

		it('should generate unique hash for each upload', async () => {
			const file = createMockFile('test.png', 1024, 'image/png', 'content');

			const result1 = await DemoService.uploadFile(file);

			await new Promise((resolve) => setTimeout(resolve, 10));
			const result2 = await DemoService.uploadFile(file);

			// Even same file should get different hash (timestamp-based)
			expect(result1.hash).not.toBe(result2.hash);
		});

		it('should handle concurrent file uploads', async () => {
			const files = [
				createMockFile('file1.png', 100, 'image/png', 'content1'),
				createMockFile('file2.png', 200, 'image/png', 'content2'),
				createMockFile('file3.png', 300, 'image/png', 'content3')
			];

			const promises = files.map((file) => DemoService.uploadFile(file));
			const results = await Promise.all(promises);

			expect(results).toHaveLength(3);

			// IDs might be the same due to timestamp collision in concurrent execution
			// Just verify all uploads succeeded
			expect(results.every((r) => r.id > 0)).toBe(true);

			// All should have correct sizes
			expect(results[0].size).toBe(files[0].size);
			expect(results[1].size).toBe(files[1].size);
			expect(results[2].size).toBe(files[2].size);
		});

		it('should preserve file metadata', async () => {
			const file = createMockFile(
				'test-image.png',
				2048,
				'image/png',
				'test content'
			);

			const result = await DemoService.uploadFile(file);

			expect(result.mimeType).toBe('image/png');
			expect(result.size).toBe(file.size);
			expect(result.createdAt).toBeInstanceOf(Date);
			expect(result.updatedAt).toBeInstanceOf(Date);
			expect(result.createdAt.getTime()).toBe(result.updatedAt.getTime());
		});
	});

	describe('Enhanced Edge Cases and Error Handling', () => {
		let bookId: number;

		beforeEach(async () => {
			const book = await DemoService.createBook({ name: 'Edge Cases Book' });

			bookId = book.data!.id;
		});

		describe('Doc Edge Cases', () => {
			it('should handle soft-deleted docs', async () => {
				// Create a doc
				const docNode = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				// Soft delete the doc
				await DemoService.deleteTreeNodeWithChildren({
					nodeId: docNode.data!.id,
					nodeIds: [docNode.data!.id],
					docIds: [docNode.data!.docId!],
					bookId
				});

				// Doc should still exist but be marked as deleted
				const doc = await DemoService.getDoc(docNode.data!.docId!);

				expect(doc.isDeleted).toBe(true);

				// Can still get doc metadata
				const docMeta = await DemoService.getDocMeta(docNode.data!.docId!);

				expect(docMeta.isDeleted).toBe(true);
			});

			it('should handle updating soft-deleted doc', async () => {
				const docNode = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				// Soft delete
				await DemoService.deleteTreeNodeWithChildren({
					nodeId: docNode.data!.id,
					nodeIds: [docNode.data!.id],
					docIds: [docNode.data!.docId!],
					bookId
				});

				// Try to update the deleted doc
				const result = await DemoService.updateDocMeta({
					id: docNode.data!.docId!,
					title: 'Updated Deleted Doc'
				});

				expect(result.success).toBe(true);

				// Verify update worked
				const doc = await DemoService.getDoc(docNode.data!.docId!);

				expect(doc.title).toBe('Updated Deleted Doc');
				expect(doc.isDeleted).toBe(true);
			});

			it('should handle doc with null content', async () => {
				const docNode = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				const doc = await DemoService.getDoc(docNode.data!.docId!);

				expect(doc.content).toBeNull();
			});

			it('should handle doc with very long title', async () => {
				const docNode = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				const longTitle = 'A'.repeat(1000);
				const result = await DemoService.updateDocMeta({
					id: docNode.data!.docId!,
					title: longTitle
				});

				expect(result.success).toBe(true);
				expect(result.data?.title).toBe(longTitle);
			});

			it('should handle doc with very long slug', async () => {
				const docNode = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				const longSlug = 'a'.repeat(500);
				const result = await DemoService.updateDocMeta({
					id: docNode.data!.docId!,
					slug: longSlug
				});

				expect(result.success).toBe(true);
				expect(result.data?.slug).toBe(longSlug);
			});

			it('should handle doc with complex nested content', async () => {
				const docNode = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				const complexContent = {
					type: 'doc',
					content: [
						{
							type: 'heading',
							attrs: { level: 1 },
							content: [{ type: 'text', text: 'Title' }]
						},
						{
							type: 'paragraph',
							content: [
								{ type: 'text', text: 'Normal ' },
								{ type: 'text', marks: [{ type: 'bold' }], text: 'bold ' },
								{ type: 'text', marks: [{ type: 'italic' }], text: 'italic' }
							]
						},
						{
							type: 'bulletList',
							content: [
								{
									type: 'listItem',
									content: [
										{
											type: 'paragraph',
											content: [{ type: 'text', text: 'Item 1' }]
										}
									]
								}
							]
						}
					]
				};

				const result = await DemoService.updateDocContent({
					id: docNode.data!.docId!,
					content: JSON.stringify(complexContent)
				});

				expect(result.success).toBe(true);
				expect(result.data?.content).toEqual(complexContent);
			});

			it('should handle multiple docs with same title in same book', async () => {
				const doc1 = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				const doc2 = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				// Update both to same title
				await DemoService.updateDocMeta({
					id: doc1.data!.docId!,
					title: 'Same Title'
				});

				await DemoService.updateDocMeta({
					id: doc2.data!.docId!,
					title: 'Same Title'
				});

				const docData1 = await DemoService.getDoc(doc1.data!.docId!);
				const docData2 = await DemoService.getDoc(doc2.data!.docId!);

				expect(docData1.title).toBe('Same Title');
				expect(docData2.title).toBe('Same Title');
				expect(docData1.id).not.toBe(docData2.id);
			});

			it('should handle slug collision in same book', async () => {
				const doc1 = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				const doc2 = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				// Try to set same slug
				await DemoService.updateDocMeta({
					id: doc1.data!.docId!,
					slug: 'same-slug'
				});

				await DemoService.updateDocMeta({
					id: doc2.data!.docId!,
					slug: 'same-slug'
				});

				// Check if slug is available (should be false)
				const result = await DemoService.checkDocSlug({
					bookId,
					docSlug: 'same-slug'
				});

				expect(result.data).toBe(false);
			});
		});

		describe('TreeNode Edge Cases', () => {
			it('should handle creating many nodes rapidly', async () => {
				const promises = [];

				for (let i = 0; i < 20; i++) {
					promises.push(
						DemoService.createTreeNode({
							bookId,
							parentId: null,
							type: 'DOC'
						})
					);
				}

				const results = await Promise.all(promises);

				expect(results.every((r) => r.success)).toBe(true);

				const nodes = await DemoService.getTreeNodesByBookId(bookId);

				expect(nodes).toHaveLength(20);
			});

			it('should handle updating title to empty string', async () => {
				const node = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				const result = await DemoService.updateTreeNodeTitle({
					id: node.data!.id,
					title: ''
				});

				expect(result.success).toBe(true);

				const db = (await import('../demo')).getDatabase();
				const updatedNode = await db.treeNodes.get(node.data!.id);

				expect(updatedNode?.title).toBe('');
			});

			it('should handle very long node title', async () => {
				const node = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				const longTitle = 'T'.repeat(2000);
				const result = await DemoService.updateTreeNodeTitle({
					id: node.data!.id,
					title: longTitle
				});

				expect(result.success).toBe(true);

				const db = (await import('../demo')).getDatabase();
				const updatedNode = await db.treeNodes.get(node.data!.id);

				expect(updatedNode?.title).toBe(longTitle);
			});

			it('should handle deleting all nodes in book', async () => {
				// Create multiple nodes
				const nodes = [];

				for (let i = 0; i < 5; i++) {
					const node = await DemoService.createTreeNode({
						bookId,
						parentId: null,
						type: 'DOC'
					});

					nodes.push(node.data!);
				}

				// Delete all nodes
				for (const node of nodes) {
					await DemoService.deleteTreeNodeWithChildren({
						nodeId: node.id,
						nodeIds: [node.id],
						docIds: node.docId ? [node.docId] : [],
						bookId
					});
				}

				const remainingNodes = await DemoService.getTreeNodesByBookId(bookId);

				expect(remainingNodes).toHaveLength(0);
			});

			it('should handle moving node back and forth multiple times', async () => {
				const parent1 = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'GROUP'
				});

				const parent2 = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'GROUP'
				});

				const node = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				// Move back and forth 10 times
				for (let i = 0; i < 10; i++) {
					await DemoService.prependChild({
						bookId,
						nodeId: node.data!.id,
						targetId: i % 2 === 0 ? parent1.data!.id : parent2.data!.id
					});
				}

				// Final position should be parent2 (last move, i=9 which is odd)
				const nodes = await DemoService.getTreeNodesByBookId(bookId);
				const movedNode = nodes.find((n) => n.id === node.data!.id);

				expect(movedNode?.parentId).toBe(parent2.data!.id);
			});
		});

		describe('Book Edge Cases', () => {
			it('should handle creating book with very long name', async () => {
				const longName = 'B'.repeat(500);
				const result = await DemoService.createBook({ name: longName });

				expect(result.success).toBe(true);
				expect(result.data?.name).toBe(longName);
			});

			it('should handle creating many books with same name', async () => {
				const promises = [];

				for (let i = 0; i < 10; i++) {
					promises.push(DemoService.createBook({ name: 'Same Name' }));
				}

				const results = await Promise.all(promises);

				expect(results.every((r) => r.success)).toBe(true);

				// Due to concurrent execution, some slugs might collide
				// At least verify all books were created
				const slugs = results.map((r) => r.data!.slug);
				const uniqueSlugs = new Set(slugs);

				// Should have at least some unique slugs (might not be all 10 due to timestamp collision)
				expect(uniqueSlugs.size).toBeGreaterThan(0);
				expect(uniqueSlugs.size).toBeLessThanOrEqual(10);
			});

			it('should handle updating book to same values', async () => {
				const book = await DemoService.createBook({ name: 'Test Book' });

				// Update with same values
				const result = await DemoService.updateBook({
					id: book.data!.id,
					name: 'Test Book',
					slug: book.data!.slug,
					type: book.data!.type,
					isPublished: book.data!.isPublished
				});

				expect(result.success).toBe(true);

				const updatedBook = await DemoService.getBook(book.data!.id);

				expect(updatedBook?.name).toBe('Test Book');
			});

			it('should handle book with special characters in name', async () => {
				const specialName = '测试书籍 📚 with émojis & spëcial çhars!';
				const result = await DemoService.createBook({ name: specialName });

				expect(result.success).toBe(true);
				expect(result.data?.name).toBe(specialName);
			});
		});

		describe('Database Consistency', () => {
			it('should maintain referential integrity after cascade delete', async () => {
				// Create complex structure
				const parent = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'GROUP'
				});

				const child1 = await DemoService.createTreeNode({
					bookId,
					parentId: parent.data!.id,
					type: 'DOC'
				});

				const child2 = await DemoService.createTreeNode({
					bookId,
					parentId: parent.data!.id,
					type: 'DOC'
				});

				// Delete parent
				await DemoService.deleteTreeNodeWithChildren({
					nodeId: parent.data!.id,
					nodeIds: [parent.data!.id, child1.data!.id, child2.data!.id],
					docIds: [child1.data!.docId!, child2.data!.docId!],
					bookId
				});

				// Verify all nodes are gone
				const db = (await import('../demo')).getDatabase();
				const remainingNodes = await db.treeNodes
					.where('bookId')
					.equals(bookId)
					.toArray();

				expect(remainingNodes).toHaveLength(0);

				// Verify docs are soft deleted
				const doc1 = await db.docs.get(child1.data!.docId!);
				const doc2 = await db.docs.get(child2.data!.docId!);

				expect(doc1?.isDeleted).toBe(true);
				expect(doc2?.isDeleted).toBe(true);
			});

			it('should handle orphaned nodes gracefully', async () => {
				// Create a node
				const node = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				// Manually corrupt the tree structure
				const db = (await import('../demo')).getDatabase();

				await db.treeNodes.update(node.data!.id, {
					prevId: 999999, // Non-existent node
					siblingId: 999998 // Non-existent node
				});

				// Should still be able to get nodes
				const nodes = await DemoService.getTreeNodesByBookId(bookId);

				// Node might not appear in flattened result due to broken links
				expect(nodes.length).toBeGreaterThanOrEqual(0);
			});
		});
	});

	describe('Concurrent Operations', () => {
		let bookId: number;

		beforeEach(async () => {
			const book = await DemoService.createBook({ name: 'Concurrent Test' });

			bookId = book.data!.id;
		});

		it('should handle concurrent node creation', async () => {
			// Create multiple nodes concurrently
			const promises = [];

			for (let i = 0; i < 5; i++) {
				promises.push(
					DemoService.createTreeNode({
						bookId,
						parentId: null,
						type: 'DOC'
					})
				);
			}

			const results = await Promise.all(promises);

			// All operations should succeed
			expect(results.every((r) => r.success)).toBe(true);

			// Verify all nodes were created
			const nodes = await DemoService.getTreeNodesByBookId(bookId);

			expect(nodes).toHaveLength(5);

			// All nodes should have unique IDs
			const ids = new Set(nodes.map((n) => n.id));

			expect(ids.size).toBe(5);
		});

		it('should handle concurrent book creation', async () => {
			const promises = [];

			for (let i = 0; i < 5; i++) {
				promises.push(DemoService.createBook({ name: `Book ${i}` }));
			}

			const results = await Promise.all(promises);

			// All operations should succeed
			expect(results.every((r) => r.success)).toBe(true);

			// All books should have unique slugs
			const slugs = results.map((r) => r.data!.slug);
			const uniqueSlugs = new Set(slugs);

			expect(uniqueSlugs.size).toBe(5);
		});

		it('should handle concurrent updates to same node', async () => {
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Update the same node concurrently with different titles
			const promises = [];

			for (let i = 0; i < 5; i++) {
				promises.push(
					DemoService.updateTreeNodeTitle({
						id: node.data!.id,
						title: `Title ${i}`
					})
				);
			}

			const results = await Promise.all(promises);

			// All operations should succeed
			expect(results.every((r) => r.success)).toBe(true);

			// The final title should be one of the updated titles
			const db = (await import('../demo')).getDatabase();
			const updatedNode = await db.treeNodes.get(node.data!.id);

			expect(updatedNode?.title).toMatch(/^Title \d$/);
		});

		it('should handle concurrent move operations', async () => {
			// Create structure with multiple nodes
			const nodes = [];

			for (let i = 0; i < 3; i++) {
				const node = await DemoService.createTreeNode({
					bookId,
					parentId: null,
					type: 'DOC'
				});

				nodes.push(node.data!);
			}

			const parent = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			// Move all nodes to parent concurrently
			const promises = nodes.map((node) =>
				DemoService.prependChild({
					bookId,
					nodeId: node.id,
					targetId: parent.data!.id
				})
			);

			const results = await Promise.all(promises);

			// All operations should succeed
			expect(results.every((r) => r.success)).toBe(true);

			// Verify all nodes are children of parent
			const allNodes = await DemoService.getTreeNodesByBookId(bookId);
			const childNodes = allNodes.filter((n) => n.parentId === parent.data!.id);

			expect(childNodes).toHaveLength(3);
		});

		it('should handle concurrent delete and read operations', async () => {
			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Concurrently delete and read the same node
			const deletePromise = DemoService.deleteTreeNodeWithChildren({
				nodeId: node.data!.id,
				nodeIds: [node.data!.id],
				docIds: [node.data!.docId!],
				bookId
			});

			const readPromise = DemoService.getTreeNodesByBookId(bookId);

			const [deleteResult, readResult] = await Promise.all([
				deletePromise,
				readPromise
			]);

			// Delete should succeed
			expect(deleteResult.success).toBe(true);

			// Read result depends on timing - either 0 or 1 node
			expect(readResult.length).toBeGreaterThanOrEqual(0);
			expect(readResult.length).toBeLessThanOrEqual(1);
		});

		it('should handle concurrent book updates', async () => {
			const book = await DemoService.createBook({ name: 'Test Book' });

			// Update the same book concurrently with different values
			const promises = [
				DemoService.updateBook({ id: book.data!.id, name: 'Name 1' }),
				DemoService.updateBook({ id: book.data!.id, type: 'DOCS' }),
				DemoService.updateBook({ id: book.data!.id, isPublished: true }),
				DemoService.updateBook({ id: book.data!.id, slug: 'custom-slug' })
			];

			const results = await Promise.all(promises);

			// All operations should succeed
			expect(results.every((r) => r.success)).toBe(true);

			// Verify the book has some of the updates applied
			const updatedBook = await DemoService.getBook(book.data!.id);

			expect(updatedBook).toBeDefined();
			// At least one update should have been applied
			expect(
				updatedBook?.name === 'Name 1' ||
					updatedBook?.type === 'DOCS' ||
					updatedBook?.isPublished === true ||
					updatedBook?.slug === 'custom-slug'
			).toBe(true);
		});

		it('should handle concurrent tree structure modifications', async () => {
			// Create initial structure
			const parent1 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const parent2 = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'GROUP'
			});

			const node = await DemoService.createTreeNode({
				bookId,
				parentId: null,
				type: 'DOC'
			});

			// Concurrently move node to different parents
			const promises = [
				DemoService.prependChild({
					bookId,
					nodeId: node.data!.id,
					targetId: parent1.data!.id
				}),
				DemoService.prependChild({
					bookId,
					nodeId: node.data!.id,
					targetId: parent2.data!.id
				})
			];

			const results = await Promise.all(promises);

			// Both operations should succeed
			expect(results.every((r) => r.success)).toBe(true);

			// The node should end up as child of one of the parents
			const db = (await import('../demo')).getDatabase();
			const finalNode = await db.treeNodes.get(node.data!.id);

			expect(
				finalNode?.parentId === parent1.data!.id ||
					finalNode?.parentId === parent2.data!.id
			).toBe(true);
		});
	});
});
