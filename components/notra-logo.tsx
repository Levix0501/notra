import Image from 'next/image';

import {
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK,
	DEFAULT_SITE_TITLE
} from '@/constants/default';

export interface NotraLogoProps {
	size: number;
}

export default function NotraLogo({ size }: NotraLogoProps) {
	return (
		<>
			<div className="dark:hidden">
				<Image
					alt={`${DEFAULT_SITE_TITLE} Logo`}
					height={size}
					src={DEFAULT_SITE_LOGO}
					width={size}
				/>
			</div>

			<div className="hidden dark:block">
				<Image
					alt={`${DEFAULT_SITE_TITLE} Dark Logo`}
					height={size}
					src={DEFAULT_SITE_LOGO_DARK}
					width={size}
				/>
			</div>
		</>
	);
}
