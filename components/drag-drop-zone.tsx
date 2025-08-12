import {
	DragDropContext,
	Draggable,
	DraggableProvided,
	DraggableRubric,
	DraggableStateSnapshot,
	Droppable,
	DroppableProvided
} from '@hello-pangea/dnd';
import { FixedSizeList } from 'react-window';

import { CatalogNodeVoWithLevel } from '@/types/catalog-node';

import CatalogItem from './catalog-item';
import CloneCatalogItem from './clone-catalog-item';

interface DragDropZoneProps {
	draggableList: CatalogNodeVoWithLevel[];
	height: number;
}

export default function DragDropZone({
	draggableList,
	height
}: Readonly<DragDropZoneProps>) {
	return (
		<DragDropContext onDragEnd={() => {}}>
			<Droppable
				isCombineEnabled
				droppableId="Catalog"
				mode="virtual"
				renderClone={(
					dragProvided: DraggableProvided,
					dragSnapshot: DraggableStateSnapshot,
					rubric: DraggableRubric
				) => (
					<CloneCatalogItem
						dragProvided={dragProvided}
						dragSnapshot={dragSnapshot}
						item={draggableList[rubric.source.index]}
					/>
				)}
			>
				{(dropProvided: DroppableProvided) => (
					<FixedSizeList
						className="px-4 md:px-2.5"
						height={height}
						itemCount={draggableList.length}
						itemData={draggableList}
						itemSize={36}
						outerRef={dropProvided.innerRef}
						width="100%"
					>
						{({ data, index, style }) => {
							const item = data[index];

							return (
								<Draggable
									key={item.id}
									draggableId={item.id.toString()}
									index={index}
								>
									{(
										dragProvided: DraggableProvided,
										dragSnapshot: DraggableStateSnapshot
									) => (
										<CatalogItem
											dragProvided={dragProvided}
											dragSnapshot={dragSnapshot}
											item={item}
											style={style}
										/>
									)}
								</Draggable>
							);
						}}
					</FixedSizeList>
				)}
			</Droppable>
		</DragDropContext>
	);
}
