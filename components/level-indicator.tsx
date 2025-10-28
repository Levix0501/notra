import { TreeNodeEntity } from '@prisma/client';

import { useTree } from '@/stores/tree';

export interface LevelIndicatorProps {
	nodeId: TreeNodeEntity['id'];
}

export function LevelIndicator({ nodeId }: Readonly<LevelIndicatorProps>) {
	const isDragging = useTree((state) => state.isDragging);
	const currentDropNode = useTree((state) => state.currentDropNode);
	const reachLevel = useTree((state) => state.reachLevelMap.get(nodeId));
	const minReachLevel = useTree(
		(state) => state.reachLevelRangeMap.get(nodeId)?.[0] ?? 0
	);

	if (
		!isDragging ||
		currentDropNode?.id !== nodeId ||
		reachLevel === undefined
	) {
		return null;
	}

	return (
		<div
			className="absolute bottom-[-5px]"
			style={{
				width: `calc(100% - ${24 * reachLevel + 24 + 9.5}px)`,
				left: `${24 * reachLevel + 24 + 9.5}px`
			}}
		>
			{Array.from(
				{
					length: reachLevel - minReachLevel
				},
				(_, i) => i
			).map((i) => (
				<div
					key={i}
					className="absolute top-[3px] h-[1.5px] w-[22px] bg-[#c0ddfc] before:absolute before:top-[-1.5px] before:h-1 before:w-[2px] before:bg-[#c0ddfc] dark:bg-[#253c56] dark:before:bg-[#253c56]"
					style={{ left: `-${24 * (i + 1)}px` }}
				></div>
			))}

			<div className="z-50 rounded-[2px] border-t-3 border-r-3 border-b-3 border-l-4 border-transparent border-l-[#117cee] dark:border-l-[#3b82ce]">
				<div className="h-[1.5px] rounded-full bg-[#117cee] dark:bg-[#3b82ce]"></div>
			</div>
		</div>
	);
}
