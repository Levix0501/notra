'use client';

import { LogOut, Settings, UserCircle2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';
import { normalizeStorageImageUrl } from '@/lib/image';

import { useGlobalSettingsDialog } from './global-settings-dialog';

const t = getTranslations('components_account_dropdown');

export function AccountDropdown() {
	const { data: session, update } = useSession();
	const inputRef = useRef<HTMLInputElement>(null);
	const [imgFailed, setImgFailed] = useState(false);

	const handleOpenGlobalSettings = () => {
		useGlobalSettingsDialog.setState({
			open: true
		});
	};

	const handleLogout = () => {
		signOut();
	};

	const rawAvatar = session?.user?.image;
	const resolvedAvatar =
		rawAvatar != null && rawAvatar !== ''
			? (normalizeStorageImageUrl(rawAvatar) ?? rawAvatar)
			: null;
	const imageSrc = resolvedAvatar && !imgFailed ? resolvedAvatar : null;

	const uploadAvatar = async (file: File) => {
		const formData = new FormData();

		formData.set('file', file);

		try {
			const response = await fetch('/api/user/avatar', {
				method: 'POST',
				body: formData
			});
			const payload = (await response.json()) as {
				success: boolean;
				message?: string;
				data?: { image?: string | null };
			};

			if (!response.ok || !payload.success) {
				toast.error(payload.message || t.avatar_upload_error);

				return;
			}

			// Must POST session with a body: bare `update()` only GETs session and does not
			// set jwt trigger "update", so the server never refetches user.image from the DB.
			const newUrl = payload.data?.image;

			await update(newUrl != null && newUrl !== '' ? { image: newUrl } : {});
			setImgFailed(false);
			toast.success(t.avatar_upload_success);
		} catch {
			toast.error(t.avatar_upload_error);
		}
	};

	return (
		<DropdownMenu modal={false}>
			<input
				ref={inputRef}
				accept="image/*"
				className="hidden"
				type="file"
				onChange={(event) => {
					const file = event.target.files?.[0];

					if (file) {
						void uploadAvatar(file);
					}

					event.target.value = '';
				}}
			/>

			<DropdownMenuTrigger
				className="rounded-full ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				type="button"
			>
				<div className="relative flex size-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-muted/40 hover:bg-muted/60">
					{imageSrc ? (
						<img
							alt=""
							className="aspect-square size-full object-cover"
							src={imageSrc}
							onError={() => setImgFailed(true)}
						/>
					) : (
						<UserCircle2 aria-hidden className="size-6 text-muted-foreground" />
					)}
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onSelect={(event) => {
						event.preventDefault();
						inputRef.current?.click();
					}}
				>
					<UserCircle2 />
					{t.change_avatar}
				</DropdownMenuItem>

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
