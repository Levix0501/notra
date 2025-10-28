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

import { useGlobalSettingsDialog } from './global-settings-dialog';

const t = getTranslations('components_account_dropdown');

export function AccountDropdown() {
	const handleOpenGlobalSettings = () => {
		useGlobalSettingsDialog.setState({
			open: true
		});
	};

	const handleLogout = () => {
		signOut();
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				<div className="cursor-pointer rounded-sm px-1.5 py-1 hover:bg-accent">
					<div className="relative size-6">
						<Image
							fill
							priority
							alt="Account Avatar"
							className="dark:invisible"
							sizes="24px"
							src={DEFAULT_ACCOUNT_AVATAR}
						/>
						<Image
							fill
							priority
							alt="Account Dark Avatar"
							className="invisible dark:visible"
							sizes="24px"
							src={DEFAULT_ACCOUNT_AVATAR_DARK}
						/>
					</div>
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={handleOpenGlobalSettings}>
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
