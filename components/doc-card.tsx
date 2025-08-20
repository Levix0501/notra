import Link from 'next/link';

import { DocMetaVo } from '@/types/doc';

interface DocCardProps {
	doc: DocMetaVo;
}

export default function DocCard({ doc }: Readonly<DocCardProps>) {
	return (
		<Link
			className="group relative flex flex-col items-center rounded-2xl border transition-all hover:opacity-100 sm:hover:bg-zinc-100"
			href="#"
		>
			<div className="relative flex aspect-video w-full items-center overflow-hidden rounded-t-2xl border-b">
				<div className="flex size-full items-center justify-center p-3 text-center sm:transition-transform sm:ease-in-out sm:group-hover:scale-105">
					<div className="text-xl font-extrabold text-zinc-600">
						{doc.title}
					</div>
				</div>
			</div>

			<div className="flex h-auto w-full min-w-0 flex-col space-y-2 px-3 py-2 text-sm sm:h-[163px] sm:px-5 sm:py-4">
				<div className="line-clamp-3 break-all text-zinc-500">
					djfklsdajfljsdlfj djfklsafjk fjdkfj fdjkf f djkfalfdjs flsdaiwoefjo
					fdsjl fdf fdoafj flds wofjwofjsdlf flddf fd fdjslfjalwei fsdjlfjiowf
					fdsf
				</div>
			</div>
		</Link>
	);
}
