import {
	BaseBoldPlugin,
	BaseCodePlugin,
	BaseHighlightPlugin,
	BaseItalicPlugin,
	BaseKbdPlugin,
	BaseStrikethroughPlugin,
	BaseSubscriptPlugin,
	BaseSuperscriptPlugin,
	BaseUnderlinePlugin
} from '@platejs/basic-nodes';

import { CodeLeafStatic } from '@/components/editor/ui/code-node-static';
import { HighlightLeafStatic } from '@/components/editor/ui/highlight-node-static';
import { KbdLeafStatic } from '@/components/editor/ui/kbd-node-static';

export const BaseBasicMarksKit = [
	BaseBoldPlugin,
	BaseItalicPlugin,
	BaseUnderlinePlugin,
	BaseCodePlugin.withComponent(CodeLeafStatic),
	BaseStrikethroughPlugin,
	BaseSubscriptPlugin,
	BaseSuperscriptPlugin,
	BaseHighlightPlugin.withComponent(HighlightLeafStatic),
	BaseKbdPlugin.withComponent(KbdLeafStatic)
];
