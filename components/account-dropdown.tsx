'use client';

import { LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
	DEFAULT_ACCOUNT_AVATAR,
	DEFAULT_ACCOUNT_AVATAR_DARK
} from '@/constants/default';
import { getTranslations } from '@/i18n';

const t = getTranslations('components_account_dropdown');

export default function AccountDropdown() {
	const handleLogout = () => {
		signOut();
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				<div className="cursor-pointer rounded-sm px-1.5 py-1 hover:bg-accent">
					<div className="dark:hidden">
						<Image
							alt="Account Avatar"
							height={24}
							src={DEFAULT_ACCOUNT_AVATAR}
							width={24}
						/>
					</div>
					<div className="hidden dark:block">
						<Image
							alt="Account Dark Avatar"
							height={24}
							src={DEFAULT_ACCOUNT_AVATAR_DARK}
							width={24}
						/>
					</div>
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuItem>
					<Settings />
					{t.settings}
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleLogout}>
						<LogOut />
						{t.logout}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
