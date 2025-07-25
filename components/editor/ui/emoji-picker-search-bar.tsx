'use client';

import * as React from 'react';

import type { UseEmojiPickerType } from '@udecode/plate-emoji/react';

export type EmojiPickerSearchBarProps = {
	children: React.ReactNode;
} & Pick<UseEmojiPickerType, 'i18n' | 'searchValue' | 'setSearch'>;

export function EmojiPickerSearchBar({
	children,
	i18n,
	searchValue,
	setSearch
}: EmojiPickerSearchBarProps) {
	return (
		<div className="flex items-center px-2">
			<div className="relative flex grow items-center">
				<input
					autoFocus
					aria-label="Search"
					autoComplete="off"
					className="block w-full appearance-none rounded-full border-0 bg-muted px-10 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-none"
					placeholder={i18n.search}
					type="text"
					value={searchValue}
					onChange={(event) => setSearch(event.target.value)}
				/>
				{children}
			</div>
		</div>
	);
}
