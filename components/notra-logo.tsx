import Image from 'next/image';

import {
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK,
	DEFAULT_SITE_TITLE
} from '@/constants/default';

export interface NotraLogoProps {
	size: number;
}

export default function NotraLogo({ size }: Readonly<NotraLogoProps>) {
	return (
		<div className="relative" style={{ width: size, height: size }}>
			<Image
				fill
				priority
				alt={`${DEFAULT_SITE_TITLE} Logo`}
				className="dark:invisible"
				src={DEFAULT_SITE_LOGO}
			/>
			<Image
				fill
				priority
				alt={`${DEFAULT_SITE_TITLE} Dark Logo`}
				className="invisible dark:visible"
				src={DEFAULT_SITE_LOGO_DARK}
			/>
		</div>
	);
}
