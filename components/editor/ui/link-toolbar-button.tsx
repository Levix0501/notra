'use client';

import {
	useLinkToolbarButton,
	useLinkToolbarButtonState
} from '@platejs/link/react';
import { Link } from 'lucide-react';
import * as React from 'react';

import { getTranslations } from '@/i18n';

import { ToolbarButton } from './toolbar';

export function LinkToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const state = useLinkToolbarButtonState();
	const { props: buttonProps } = useLinkToolbarButton(state);

	return (
		<ToolbarButton
			{...props}
			{...buttonProps}
			data-plate-focus
			tooltip={getTranslations('notra_editor').link_toolbar_button_link}
		>
			<Link />
		</ToolbarButton>
	);
}
