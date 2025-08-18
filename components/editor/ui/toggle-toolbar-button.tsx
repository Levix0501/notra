'use client';

import {
	useToggleToolbarButton,
	useToggleToolbarButtonState
} from '@platejs/toggle/react';
import { ListCollapseIcon } from 'lucide-react';
import * as React from 'react';

import { getTranslations } from '@/i18n';

import { ToolbarButton } from './toolbar';

export function ToggleToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const state = useToggleToolbarButtonState();
	const { props: buttonProps } = useToggleToolbarButton(state);

	return (
		<ToolbarButton
			{...props}
			{...buttonProps}
			tooltip={getTranslations('notra_editor').toggle_toolbar_button_toggle}
		>
			<ListCollapseIcon />
		</ToolbarButton>
	);
}
