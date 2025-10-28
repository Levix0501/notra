import { Slice, Fragment } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Extension, CommandProps, Editor } from '@tiptap/react';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';

import type { Node as ProseMirrorNode, Schema, Mark } from '@tiptap/pm/model';
import type {
	RootContent,
	ListItem,
	Table,
	TableRow,
	TableCell,
	PhrasingContent,
	Text,
	InlineCode
} from 'mdast';

declare module '@tiptap/react' {
	interface Commands<ReturnType> {
		markdownPaste: {
			pasteMarkdown: (content: string) => ReturnType;
		};
	}
}

export const MarkdownPaste = Extension.create({
	name: 'markdownPaste',
	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: new PluginKey('markdownPaste'),
				props: {
					handleDOMEvents: {
						paste: (view, event: ClipboardEvent) => {
							const text = event.clipboardData?.getData('text/plain') ?? '';

							if (!text.trim() || !isMarkdownContent(text)) {
								return false;
							}

							event.preventDefault();

							try {
								const nodes = parseMarkdownToProseMirror(text, this.editor);

								if (nodes.length > 0) {
									const tr = view.state.tr;

									if (nodes.length === 1) {
										tr.replaceSelectionWith(nodes[0]);
									} else {
										tr.replaceSelection(
											new Slice(Fragment.fromArray(nodes), 0, 0)
										);
									}

									view.dispatch(tr);

									return true;
								}
							} catch (e) {
								console.error('Failed to paste Markdown:', e);
							}

							return false;
						}
					}
				}
			})
		];
	},

	addCommands() {
		return {
			pasteMarkdown:
				(content: string) =>
				({ tr, dispatch }: CommandProps) => {
					try {
						const nodes = parseMarkdownToProseMirror(content, this.editor);

						if (nodes.length > 0) {
							if (nodes.length === 1) {
								dispatch?.(tr.replaceSelectionWith(nodes[0]));
							} else {
								dispatch?.(
									tr.replaceSelection(
										new Slice(Fragment.fromArray(nodes), 0, 0)
									)
								);
							}

							return true;
						}
					} catch (error) {
						console.error('Failed to paste Markdown:', error);
					}

					return false;
				}
		};
	}
});

function isMarkdownContent(text: string): boolean {
	const patterns = [
		/^#{1,6}\s+/,
		/^\*\*.*\*\*/,
		/^__.*__/,
		/^\*.*\*/,
		/^_.*_/,
		/^```/,
		/^`.*`/,
		/^\[.*\]\(.*\)/,
		/^!\[.*\]\(.*\)/,
		/^[-*+]\s+/,
		/^\d+\.\s+/,
		/^>\s+/,
		/^\|.*\|/,
		/^[-*_]{3,}/,
		/^- \[[ xX]\]/
	];

	return text
		.split('\n')
		.some((line) => patterns.some((p) => p.test(line.trim())));
}

function parseMarkdownToProseMirror(
	md: string,
	editor: Editor
): ProseMirrorNode[] {
	const tree = fromMarkdown(md, {
		extensions: [gfm()],
		mdastExtensions: [gfmFromMarkdown()]
	});

	return mdastToProseMirror(tree.children, editor.schema);
}

function mdastToProseMirror(
	children: RootContent[],
	schema: Schema
): ProseMirrorNode[] {
	return children
		.map((child) => mdastNodeToPM(child, schema))
		.flat()
		.filter((node): node is ProseMirrorNode => node !== null);
}

function mdastNodeToPM(
	node: RootContent,
	schema: Schema
): ProseMirrorNode | ProseMirrorNode[] | null {
	switch (node.type) {
		case 'paragraph':
			const nodes: ProseMirrorNode[] = [];
			let inlineNodes: RootContent[] = [];

			for (const child of node.children || []) {
				if (['image'].includes(child.type)) {
					if (inlineNodes.length > 0) {
						nodes.push(
							schema.nodes.paragraph.create(
								{},
								mdastInlineToPM(inlineNodes as PhrasingContent[], schema)
							)
						);
						inlineNodes = [];
					}

					nodes.push(mdastNodeToPM(child, schema) as ProseMirrorNode);
				} else {
					inlineNodes.push(child);
				}
			}

			if (inlineNodes.length > 0) {
				nodes.push(
					schema.nodes.paragraph.create(
						{},
						mdastInlineToPM(inlineNodes as PhrasingContent[], schema)
					)
				);
				inlineNodes = [];
			}

			return nodes;

		case 'heading':
			return schema.nodes.heading.create(
				{ level: Math.min(Math.max(node.depth || 1, 1), 6) },
				mdastInlineToPM(node.children || [], schema)
			);

		case 'blockquote': {
			return (
				schema.nodes.blockquote?.create(
					{},
					mdastToProseMirror(node.children || [], schema)
				) || null
			);
		}

		case 'code':
			return schema.nodes.codeBlock.create(
				{ language: node.lang || '' },
				node.value ? [schema.text(node.value)] : []
			);

		case 'list': {
			const listType = node.ordered ? 'orderedList' : 'bulletList';
			const items = (node.children || [])
				.map((item: ListItem) => {
					if (item.type !== 'listItem') return null;

					const listItemContent: ProseMirrorNode[] = [];

					for (const child of item.children || []) {
						const childNode = mdastNodeToPM(child, schema);

						if (Array.isArray(childNode)) {
							listItemContent.push(...childNode);
						} else if (childNode) {
							listItemContent.push(childNode);
						}
					}

					if (
						item.checked !== null &&
						item.checked !== undefined &&
						schema.nodes.taskItem
					) {
						return schema.nodes.taskItem.create(
							{ checked: item.checked },
							listItemContent
						);
					}

					return schema.nodes.listItem.create({}, listItemContent);
				})
				.filter((item): item is ProseMirrorNode => item !== null);

			return schema.nodes[listType]?.create({}, items) || null;
		}

		case 'thematicBreak':
			return schema.nodes.horizontalRule?.create() || null;

		case 'table': {
			if (
				!schema.nodes.table ||
				!schema.nodes.tableRow ||
				!schema.nodes.tableHeader ||
				!schema.nodes.tableCell
			)
				return null;

			const rows = (node as Table).children.map(
				(row: TableRow, rowIdx: number) => {
					const cells = row.children.map((cell: TableCell) => {
						const cellContent = mdastInlineToPM(cell.children || [], schema);
						const cellType = rowIdx === 0 ? 'tableHeader' : 'tableCell';

						return schema.nodes[cellType].create(
							{},
							cellContent.length
								? cellContent
								: [schema.nodes.paragraph.create()]
						);
					});

					return schema.nodes.tableRow.create({}, cells);
				}
			);

			return schema.nodes.table.create({}, rows);
		}

		case 'image':
			return (
				schema.nodes.image?.create({
					src: node.url,
					alt: node.alt || '',
					title: node.title || ''
				}) || null
			);

		default: {
			if ('value' in node && typeof node.value === 'string') {
				return schema.nodes.paragraph.create({}, [schema.text(node.value)]);
			}

			if ('children' in node && node.children) {
				const content = mdastToProseMirror(node.children || [], schema);

				if (content.length > 0) {
					return schema.nodes.paragraph.create({}, content);
				}
			}

			return null;
		}
	}
}

function mdastInlineToPM(
	children: PhrasingContent[],
	schema: Schema
): ProseMirrorNode[] {
	const content: ProseMirrorNode[] = [];

	for (const child of children) {
		switch (child.type) {
			case 'text':
				content.push(schema.text((child as Text).value));
				break;

			case 'strong':
				content.push(
					...mdastInlineToPM(child.children || [], schema).map((node) =>
						addMark(node, schema.marks.bold.create())
					)
				);
				break;

			case 'emphasis':
				content.push(
					...mdastInlineToPM(child.children || [], schema).map((node) =>
						addMark(node, schema.marks.italic.create())
					)
				);
				break;

			case 'inlineCode':
				content.push(
					addMark(
						schema.text((child as InlineCode).value),
						schema.marks.code.create()
					)
				);
				break;

			case 'link':
				content.push(
					...mdastInlineToPM(child.children || [], schema).map((node) =>
						addMark(
							node,
							schema.marks.link.create({ href: child.url, title: child.title })
						)
					)
				);
				break;

			case 'delete':
				if (schema.marks.strike) {
					content.push(
						...mdastInlineToPM(child.children || [], schema).map((node) =>
							addMark(node, schema.marks.strike.create())
						)
					);
				} else {
					content.push(...mdastInlineToPM(child.children || [], schema));
				}

				break;

			default:
				if (
					'value' in child &&
					typeof (child as { value: string }).value === 'string'
				) {
					content.push(schema.text((child as { value: string }).value));
				} else if (
					'children' in child &&
					(child as { children: PhrasingContent[] }).children
				) {
					content.push(
						...mdastInlineToPM(
							(child as { children: PhrasingContent[] }).children,
							schema
						)
					);
				}

				break;
		}
	}

	return content;
}

function addMark(node: ProseMirrorNode, mark: Mark): ProseMirrorNode {
	if (node.isText) {
		return node.type.schema.text(node.text || '', node.marks.concat([mark]));
	}

	return node.type.create(node.attrs, node.content, node.marks.concat([mark]));
}
