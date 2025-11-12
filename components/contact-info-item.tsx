'use client';

import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { BookEntity, TreeNodeEntity } from '@prisma/client';
import Link from 'next/link';
import { CSSProperties } from 'react';
import { z } from 'zod';

import { CONTACT_INFO_ICONS } from '@/constants/contact';
import { useGetSiteSettings } from '@/queries/site-settings';
import { TreeNodeVoWithLevel } from '@/types/tree-node';

import { ContactInfoIcon } from './contact-info-icon';
import { ContactInfoItemLevelIndicator } from './contact-info-item-level-indicator';
import { ContactInfoItemMoreDropdown } from './contact-info-item-more-dropdown';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export interface ContactInfoItemProps {
	dragProvided: DraggableProvided;
	dragSnapshot: DraggableStateSnapshot;
	bookId: BookEntity['id'];
	item: TreeNodeVoWithLevel;
	style?: CSSProperties;
}

export const ContactInfoItem = ({
	dragProvided,
	bookId,
	item,
	style
}: ContactInfoItemProps) => {
	const { data: siteSettings } = useGetSiteSettings();

	const icon = CONTACT_INFO_ICONS.find((icon) => icon.slug === item.icon);

	return (
		<div
			{...dragProvided.draggableProps}
			{...dragProvided.dragHandleProps}
			ref={dragProvided.innerRef}
			className="group/item px-4 md:px-2.5"
			style={{
				...style,
				...dragProvided.draggableProps.style,
				cursor: 'pointer'
			}}
		>
			<ContactInfoItemWrapper url={item.url}>
				<div className="my-px flex h-8.5 items-center justify-between rounded-md border-[1.5px] border-transparent px-1 text-sm hover:bg-sidebar-accent">
					<div className="relative mr-1 size-6">
						<div className="flex size-6 items-center justify-center">
							<ContactInfoIcon
								colored={siteSettings?.coloredContactIcons ?? false}
								darkInvert={icon?.darkInvert ?? false}
								hex={icon?.hex ?? ''}
								svg={icon?.svg ?? ''}
							/>
						</div>

						{!item.isPublished && (
							<div className="pointer-events-none absolute right-0.5 bottom-0.5 size-2 rounded-full bg-sidebar">
								<div className="absolute top-1/2 left-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EA580C]"></div>
							</div>
						)}
					</div>

					<ContactInfoItemMoreDropdown bookId={bookId} item={item} />
				</div>
			</ContactInfoItemWrapper>

			<ContactInfoItemLevelIndicator nodeId={item.id} />
		</div>
	);
};

export const ContactInfoItemWrapper = ({
	children,
	url
}: {
	children: React.ReactNode;
	url: TreeNodeEntity['url'];
}) => {
	const trimmedUrl = url?.trim();
	const parsedUrl = z.url().safeParse(trimmedUrl);
	const parsedEmail = z.email().safeParse(trimmedUrl);

	if (parsedUrl.success || parsedEmail.success) {
		return (
			<Link
				href={parsedUrl.data ? parsedUrl.data : `mailto:${parsedEmail.data}`}
				target="_blank"
			>
				{children}
			</Link>
		);
	}

	return (
		<Popover>
			<PopoverTrigger asChild className="cursor-pointer">
				{children}
			</PopoverTrigger>
			<PopoverContent className="w-auto max-w-80 text-sm">
				{trimmedUrl}
			</PopoverContent>
		</Popover>
	);
};
