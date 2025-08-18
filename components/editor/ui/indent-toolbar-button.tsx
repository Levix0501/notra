'use client';

import { useIndentButton, useOutdentButton } from '@platejs/indent/react';
import { IndentIcon, OutdentIcon } from 'lucide-react';
import * as React from 'react';

import { getTranslations } from '@/i18n';

import { ToolbarButton } from './toolbar';

export function IndentToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const { props: buttonProps } = useIndentButton();

	return (
		<ToolbarButton
			{...props}
			{...buttonProps}
			tooltip={getTranslations('notra_editor').indent_toolbar_button_indent}
		>
			<IndentIcon />
		</ToolbarButton>
	);
}

export function OutdentToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const { props: buttonProps } = useOutdentButton();

	return (
		<ToolbarButton
			{...props}
			{...buttonProps}
			tooltip={getTranslations('notra_editor').indent_toolbar_button_outdent}
		>
			<OutdentIcon />
		</ToolbarButton>
	);
}
