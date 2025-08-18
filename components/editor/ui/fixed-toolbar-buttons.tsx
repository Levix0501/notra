'use client';

import {
	ArrowUpToLineIcon,
	BaselineIcon,
	BoldIcon,
	Code2Icon,
	ItalicIcon,
	PaintBucketIcon,
	StrikethroughIcon,
	UnderlineIcon
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { getTranslations } from '@/i18n';

import { AlignToolbarButton } from './align-toolbar-button';
import { EmojiToolbarButton } from './emoji-toolbar-button';
import { ExportToolbarButton } from './export-toolbar-button';
import { FontColorToolbarButton } from './font-color-toolbar-button';
import { FontSizeToolbarButton } from './font-size-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { ImportToolbarButton } from './import-toolbar-button';
import {
	IndentToolbarButton,
	OutdentToolbarButton
} from './indent-toolbar-button';
import { InsertToolbarButton } from './insert-toolbar-button';
import { LineHeightToolbarButton } from './line-height-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import {
	BulletedListToolbarButton,
	NumberedListToolbarButton,
	TodoListToolbarButton
} from './list-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MediaToolbarButton } from './media-toolbar-button';
import { MoreToolbarButton } from './more-toolbar-button';
import { TableToolbarButton } from './table-toolbar-button';
import { ToggleToolbarButton } from './toggle-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { TurnIntoToolbarButton } from './turn-into-toolbar-button';

const t = getTranslations('notra_editor');

export function FixedToolbarButtons() {
	const readOnly = useEditorReadOnly();

	return (
		<div className="flex w-full">
			{!readOnly && (
				<>
					<ToolbarGroup>
						<UndoToolbarButton />
						<RedoToolbarButton />
					</ToolbarGroup>

					{/* <ToolbarGroup>
						<AIToolbarButton tooltip="AI commands">
							<WandSparklesIcon />
						</AIToolbarButton>
					</ToolbarGroup> */}

					<ToolbarGroup>
						<ExportToolbarButton>
							<ArrowUpToLineIcon />
						</ExportToolbarButton>

						<ImportToolbarButton />
					</ToolbarGroup>

					<ToolbarGroup>
						<InsertToolbarButton />
						<TurnIntoToolbarButton />
						<FontSizeToolbarButton />
					</ToolbarGroup>

					<ToolbarGroup>
						<MarkToolbarButton
							nodeType={KEYS.bold}
							tooltip={t.fixed_toolbar_bold}
						>
							<BoldIcon />
						</MarkToolbarButton>

						<MarkToolbarButton
							nodeType={KEYS.italic}
							tooltip={t.fixed_toolbar_italic}
						>
							<ItalicIcon />
						</MarkToolbarButton>

						<MarkToolbarButton
							nodeType={KEYS.underline}
							tooltip={t.fixed_toolbar_underline}
						>
							<UnderlineIcon />
						</MarkToolbarButton>

						<MarkToolbarButton
							nodeType={KEYS.strikethrough}
							tooltip={t.fixed_toolbar_strikethrough}
						>
							<StrikethroughIcon />
						</MarkToolbarButton>

						<MarkToolbarButton
							nodeType={KEYS.code}
							tooltip={t.fixed_toolbar_code_inline}
						>
							<Code2Icon />
						</MarkToolbarButton>

						<FontColorToolbarButton
							nodeType={KEYS.color}
							tooltip={t.fixed_toolbar_text_color}
						>
							<BaselineIcon />
						</FontColorToolbarButton>

						<FontColorToolbarButton
							nodeType={KEYS.backgroundColor}
							tooltip={t.fixed_toolbar_background_color}
						>
							<PaintBucketIcon />
						</FontColorToolbarButton>
					</ToolbarGroup>

					<ToolbarGroup>
						<AlignToolbarButton />

						<NumberedListToolbarButton />
						<BulletedListToolbarButton />
						<TodoListToolbarButton />
						<ToggleToolbarButton />
					</ToolbarGroup>

					<ToolbarGroup>
						<LinkToolbarButton />
						<TableToolbarButton />
						<EmojiToolbarButton />
					</ToolbarGroup>

					<ToolbarGroup>
						<MediaToolbarButton nodeType={KEYS.img} />
						<MediaToolbarButton nodeType={KEYS.video} />
						<MediaToolbarButton nodeType={KEYS.audio} />
						<MediaToolbarButton nodeType={KEYS.file} />
					</ToolbarGroup>

					<ToolbarGroup>
						<LineHeightToolbarButton />
						<OutdentToolbarButton />
						<IndentToolbarButton />
					</ToolbarGroup>

					<ToolbarGroup>
						<MoreToolbarButton />
					</ToolbarGroup>
				</>
			)}

			<div className="grow" />

			{/* <ToolbarGroup>
				<MarkToolbarButton nodeType={KEYS.highlight} tooltip="Highlight">
					<HighlighterIcon />
				</MarkToolbarButton>
				<CommentToolbarButton />
			</ToolbarGroup>

			<ToolbarGroup>
				<ModeToolbarButton />
			</ToolbarGroup> */}
		</div>
	);
}
