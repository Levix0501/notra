import Image from 'next/image';
import Link from 'next/link';

import { ThemeChanger } from '@/components/theme-changer';
import {
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK,
	DEFAULT_SITE_TITLE
} from '@/constants/default';

export default function Home() {
	return (
		<>
			<header className="sticky top-0 z-40 h-14 px-6 backdrop-blur-[5px] backdrop-saturate-[180%]">
				<div className="container mx-auto flex h-full items-center justify-between">
					<Link
						className="flex h-full items-center gap-2 font-semibold"
						href="/"
					>
						<>
							<div className="dark:hidden">
								<Image
									alt={`${DEFAULT_SITE_TITLE} Logo`}
									height={24}
									src={DEFAULT_SITE_LOGO}
									width={24}
								/>
							</div>

							<div className="hidden dark:block">
								<Image
									alt={`${DEFAULT_SITE_TITLE} Dark Logo`}
									height={24}
									src={DEFAULT_SITE_LOGO_DARK}
									width={24}
								/>
							</div>
						</>
						<span>{DEFAULT_SITE_TITLE}</span>
					</Link>
					<ThemeChanger />
				</div>
			</header>
		</>
	);
}
