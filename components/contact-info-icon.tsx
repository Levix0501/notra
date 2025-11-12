import { cn } from '@/lib/utils';

export function ContactInfoIcon({
	svg,
	hex,
	colored,
	darkInvert
}: {
	svg: string;
	hex: string;
	colored: boolean;
	darkInvert: boolean;
}) {
	return (
		<div
			dangerouslySetInnerHTML={{ __html: svg }}
			className={cn(
				'size-5 [&_svg]:!size-5',
				colored && darkInvert && 'dark:[&_svg]:invert'
			)}
			style={{
				fill: colored ? (hex ? `#${hex}` : 'currentColor') : 'currentColor'
			}}
		/>
	);
}
