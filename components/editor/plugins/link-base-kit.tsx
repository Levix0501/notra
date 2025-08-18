import { BaseLinkPlugin } from '@platejs/link';

import { LinkElementStatic } from '@/components/editor/ui/link-node-static';

export const BaseLinkKit = [BaseLinkPlugin.withComponent(LinkElementStatic)];
