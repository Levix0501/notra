'use client';

import { List, ListOrdered, ListTodo } from 'lucide-react';
import * as React from 'react';

import { getTranslations } from '@/i18n';

import { isNodeInSchema } from '../tiptap-utils';
import { canToggleList, isListActive, listIcons, ListType } from './use-list';
import { useTiptapEditor } from './use-tiptap-editor';

import type { Editor } from '@tiptap/react';

const t = getTranslations('notra_editor');

/**
 * Configuration for the list dropdown menu functionality
 */
export interface UseListDropdownMenuConfig {
	/**
	 * The Tiptap editor instance.
	 */
	editor?: Editor | null;
	/**
	 * The list types to display in the dropdown.
	 * @default ["bulletList", "orderedList", "taskList"]
	 */
	types?: ListType[];
	/**
	 * Whether the dropdown should be hidden when no list types are available
	 * @default false
	 */
	hideWhenUnavailable?: boolean;
}

export interface ListOption {
	label: string;
	type: ListType;
	icon: React.ElementType;
}

export const listOptions: ListOption[] = [
	{
		label: t.bulleted_list,
		type: 'bulletList',
		icon: List
	},
	{
		label: t.numbered_list,
		type: 'orderedList',
		icon: ListOrdered
	},
	{
		label: t.todo_list,
		type: 'taskList',
		icon: ListTodo
	}
];

export function canToggleAnyList(
	editor: Editor | null,
	listTypes: ListType[]
): boolean {
	if (!editor || !editor.isEditable) return false;

	return listTypes.some((type) => canToggleList(editor, type));
}

export function isAnyListActive(
	editor: Editor | null,
	listTypes: ListType[]
): boolean {
	if (!editor || !editor.isEditable) return false;

	return listTypes.some((type) => isListActive(editor, type));
}

export function getFilteredListOptions(
	availableTypes: ListType[]
): typeof listOptions {
	return listOptions.filter(
		(option) => !option.type || availableTypes.includes(option.type)
	);
}

export function shouldShowListDropdown(params: {
	editor: Editor | null;
	listTypes: ListType[];
	hideWhenUnavailable: boolean;
	listInSchema: boolean;
	canToggleAny: boolean;
}): boolean {
	const { editor, hideWhenUnavailable, listInSchema, canToggleAny } = params;

	if (!listInSchema || !editor) {
		return false;
	}

	if (hideWhenUnavailable && !editor.isActive('code')) {
		return canToggleAny;
	}

	return true;
}

/**
 * Gets the currently active list type from the available types
 */
export function getActiveListType(
	editor: Editor | null,
	availableTypes: ListType[]
): ListType | undefined {
	if (!editor || !editor.isEditable) return undefined;

	return availableTypes.find((type) => isListActive(editor, type));
}

/**
 * Custom hook that provides list dropdown menu functionality for Tiptap editor
 *
 * @example
 * ```tsx
 * // Simple usage
 * function MyListDropdown() {
 *   const {
 *     isVisible,
 *     activeType,
 *     isAnyActive,
 *     canToggleAny,
 *     filteredLists,
 *   } = useListDropdownMenu()
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <DropdownMenu>
 *       // dropdown content
 *     </DropdownMenu>
 *   )
 * }
 *
 * // Advanced usage with configuration
 * function MyAdvancedListDropdown() {
 *   const {
 *     isVisible,
 *     activeType,
 *   } = useListDropdownMenu({
 *     editor: myEditor,
 *     types: ["bulletList", "orderedList"],
 *     hideWhenUnavailable: true,
 *   })
 *
 *   // component implementation
 * }
 * ```
 */
export function useListDropdownMenu(config?: UseListDropdownMenuConfig) {
	const {
		editor: providedEditor,
		types = ['bulletList', 'orderedList', 'taskList'],
		hideWhenUnavailable = false
	} = config || {};

	const { editor } = useTiptapEditor(providedEditor);
	const [isVisible, setIsVisible] = React.useState(false);

	const listInSchema = types.some((type) => isNodeInSchema(type, editor));

	const filteredLists = React.useMemo(
		() => getFilteredListOptions(types),
		[types]
	);

	const canToggleAny = canToggleAnyList(editor, types);
	const isAnyActive = isAnyListActive(editor, types);
	const activeType = getActiveListType(editor, types);
	const activeList = filteredLists.find((option) => option.type === activeType);

	React.useEffect(() => {
		if (!editor) return;

		const handleSelectionUpdate = () => {
			setIsVisible(
				shouldShowListDropdown({
					editor,
					listTypes: types,
					hideWhenUnavailable,
					listInSchema,
					canToggleAny
				})
			);
		};

		handleSelectionUpdate();

		editor.on('selectionUpdate', handleSelectionUpdate);

		return () => {
			editor.off('selectionUpdate', handleSelectionUpdate);
		};
	}, [canToggleAny, editor, hideWhenUnavailable, listInSchema, types]);

	return {
		isVisible,
		activeType,
		isActive: isAnyActive,
		canToggle: canToggleAny,
		types,
		filteredLists,
		label: 'List',
		Icon: activeList ? listIcons[activeList.type] : List
	};
}
