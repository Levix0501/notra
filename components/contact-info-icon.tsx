export function ContactInfoIcon({
	svg,
	hex,
	colored
}: {
	svg: string;
	hex: string;
	colored: boolean;
}) {
	return (
		<div
			dangerouslySetInnerHTML={{ __html: svg }}
			className="size-5 [&_svg]:!size-5"
			style={{
				fill: colored ? (hex ? `#${hex}` : 'currentColor') : 'currentColor'
			}}
		/>
	);
}
