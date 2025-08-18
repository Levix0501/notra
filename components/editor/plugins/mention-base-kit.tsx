import { BaseMentionPlugin } from '@platejs/mention';

import { MentionElementStatic } from '@/components/editor/ui/mention-node-static';

export const BaseMentionKit = [
	BaseMentionPlugin.withComponent(MentionElementStatic)
];
