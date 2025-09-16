import { PluginKey } from '@tiptap/pm/state';
import { Editor, Extension, ReactRenderer } from '@tiptap/react';
import {
	Suggestion,
	SuggestionKeyDownProps,
	SuggestionProps
} from '@tiptap/suggestion';

import {
	groups,
	POPOVER_GAP,
	POPOVER_MAX_HEIGHT,
	POPOVER_MIN_HEIGHT,
	POPOVER_WIDTH,
	SlashCommandPopover,
	SlashCommandPopoverHandle
} from '@/components/editor/ui/slash-command-popover';

const EXTENSION_NAME = 'slashCommand';

export const SlashCommand = Extension.create({
	name: EXTENSION_NAME,
	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				char: '/',
				allowSpaces: true,
				startOfLine: true,
				pluginKey: new PluginKey(EXTENSION_NAME),
				command: ({
					editor,
					props
				}: {
					editor: Editor;
					props: { action: (editor: Editor) => void };
				}) => {
					const { view, state } = editor;
					const { $head, $from } = view.state.selection;

					const end = $from.pos;
					const from = $head?.nodeBefore
						? end -
							($head.nodeBefore.text?.substring(
								$head.nodeBefore.text?.indexOf('/')
							).length ?? 0)
						: $from.start();

					const tr = state.tr.deleteRange(from, end);

					view.dispatch(tr);
					props.action(editor);
					view.focus();
				},
				items: ({ query }: { query: string }) => {
					return groups
						.map((group) => ({
							...group,
							items: group.items.filter((item) => {
								const labelNormalized = item.label.toLowerCase().trim();
								const enLabelNormalized = item.enLabel.toLowerCase().trim();
								const queryNormalized = query.toLowerCase().trim();

								if (item.keywords) {
									const keywords = item.keywords.map((alias) =>
										alias.toLowerCase().trim()
									);

									return (
										labelNormalized.includes(queryNormalized) ||
										enLabelNormalized.includes(queryNormalized) ||
										keywords.includes(queryNormalized)
									);
								}

								return (
									labelNormalized.includes(queryNormalized) ||
									enLabelNormalized.includes(queryNormalized)
								);
							})
						}))
						.filter((group) => group.items.length > 0);
				},
				render: () => {
					let component: ReactRenderer<SlashCommandPopoverHandle> | null = null;

					const getPopoverRect = (props: SuggestionProps) => {
						if (!props.clientRect) {
							return new DOMRect(0, 0, POPOVER_WIDTH, POPOVER_MAX_HEIGHT);
						}

						const rect = props.clientRect();

						if (!rect) {
							return new DOMRect(0, 0, POPOVER_WIDTH, POPOVER_MAX_HEIGHT);
						}

						if (rect.y + POPOVER_MIN_HEIGHT > window.innerHeight) {
							return new DOMRect(
								rect.x,
								Math.max(0, rect.y - POPOVER_GAP * 2 - POPOVER_MAX_HEIGHT),
								POPOVER_WIDTH,
								Math.min(rect.y - POPOVER_GAP * 2, POPOVER_MAX_HEIGHT)
							);
						}

						return new DOMRect(
							rect.x,
							rect.y + rect.height + POPOVER_GAP,
							POPOVER_WIDTH,
							Math.min(
								window.innerHeight - rect.y - rect.height - POPOVER_GAP * 2,
								POPOVER_MAX_HEIGHT
							)
						);
					};

					return {
						onBeforeStart: () => {
							if (component) {
								component.updateProps({
									isOpen: false
								});
								component.destroy();
								component = null;
							}
						},
						onStart: (props: SuggestionProps) => {
							const { view } = props.editor;
							const popoverRect = getPopoverRect(props);

							component = new ReactRenderer(SlashCommandPopover, {
								props: {
									...props,
									popoverRect,
									isOpen: true
								},
								editor: props.editor
							});

							view.focus();
						},
						onUpdate(props: SuggestionProps) {
							const popoverRect = getPopoverRect(props);

							component?.updateProps({
								...props,
								popoverRect
							});
						},
						onKeyDown(props: SuggestionKeyDownProps) {
							const handled = component?.ref?.onKeyDown(props) ?? false;

							if (props.event.key === 'Enter' && handled) {
								props.event.preventDefault();
								props.event.stopPropagation();
								component?.destroy();

								return true;
							}

							return handled;
						},
						onExit() {
							component?.destroy();
						}
					};
				}
			})
		];
	}
});

export default SlashCommand;
