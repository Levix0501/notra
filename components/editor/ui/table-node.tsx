'use client';

import { useDraggable, useDropLine } from '@platejs/dnd';
import {
	BlockSelectionPlugin,
	useBlockSelected
} from '@platejs/selection/react';
import { setCellBackground } from '@platejs/table';
import {
	TablePlugin,
	TableProvider,
	useTableBordersDropdownMenuContentState,
	useTableCellElement,
	useTableCellElementResizable,
	useTableElement,
	useTableMergeState
} from '@platejs/table/react';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { cva } from 'class-variance-authority';
import {
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	CombineIcon,
	EraserIcon,
	Grid2X2Icon,
	GripVertical,
	PaintBucketIcon,
	SquareSplitHorizontalIcon,
	Trash2Icon,
	XIcon
} from 'lucide-react';
import {
	type TElement,
	type TTableCellElement,
	type TTableElement,
	type TTableRowElement,
	KEYS,
	PathApi
} from 'platejs';
import {
	type PlateElementProps,
	PlateElement,
	useComposedRef,
	useEditorPlugin,
	useEditorRef,
	useEditorSelector,
	useElement,
	usePluginOption,
	useReadOnly,
	useRemoveNodeButton,
	useSelected,
	withHOC
} from 'platejs/react';
import { useElementSelector } from 'platejs/react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

import { blockSelectionVariants } from './block-selection';
import {
	ColorDropdownMenuItems,
	DEFAULT_COLORS
} from './font-color-toolbar-button';
import { ResizeHandle } from './resize-handle';
import {
	BorderAllIcon,
	BorderBottomIcon,
	BorderLeftIcon,
	BorderNoneIcon,
	BorderRightIcon,
	BorderTopIcon
} from './table-icons';
import {
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
	ToolbarMenuGroup
} from './toolbar';

import type * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

const t = getTranslations('notra_editor');

export const TableElement = withHOC(
	TableProvider,
	function TableElement({
		children,
		...props
	}: PlateElementProps<TTableElement>) {
		const readOnly = useReadOnly();
		const isSelectionAreaVisible = usePluginOption(
			BlockSelectionPlugin,
			'isSelectionAreaVisible'
		);
		const hasControls = !readOnly && !isSelectionAreaVisible;
		const selected = useSelected();
		const {
			isSelectingCell,
			marginLeft,
			props: tableProps
		} = useTableElement();

		const content = (
			<PlateElement
				{...props}
				className={cn(
					'overflow-x-auto py-5',
					hasControls && '-ml-2 *:data-[slot=block-selection]:left-2'
				)}
				style={{ paddingLeft: marginLeft }}
			>
				<div className="group/table relative w-fit">
					<table
						className={cn(
							'mr-0 ml-px table h-px table-fixed border-collapse',
							isSelectingCell && 'selection:bg-transparent'
						)}
						{...tableProps}
					>
						<tbody className="min-w-full">{children}</tbody>
					</table>
				</div>
			</PlateElement>
		);

		if (readOnly || !selected) {
			return content;
		}

		return <TableFloatingToolbar>{content}</TableFloatingToolbar>;
	}
);

function TableFloatingToolbar({
	children,
	...props
}: React.ComponentProps<typeof PopoverContent>) {
	const { tf } = useEditorPlugin(TablePlugin);
	const element = useElement<TTableElement>();
	const { props: buttonProps } = useRemoveNodeButton({ element });
	const collapsed = useEditorSelector((editor) => !editor.api.isExpanded(), []);

	const { canMerge, canSplit } = useTableMergeState();

	return (
		<Popover modal={false} open={canMerge || canSplit || collapsed}>
			<PopoverAnchor asChild>{children}</PopoverAnchor>
			<PopoverContent
				asChild
				contentEditable={false}
				onOpenAutoFocus={(e) => e.preventDefault()}
				{...props}
			>
				<Toolbar
					className="scrollbar-hide flex w-auto max-w-[80vw] flex-row overflow-x-auto rounded-md border bg-popover p-1 shadow-md print:hidden"
					contentEditable={false}
				>
					<ToolbarGroup>
						<ColorDropdownMenu tooltip={t.table_node_background_color}>
							<PaintBucketIcon />
						</ColorDropdownMenu>
						{canMerge && (
							<ToolbarButton
								tooltip={t.table_node_merge_cells}
								onClick={() => tf.table.merge()}
								onMouseDown={(e) => e.preventDefault()}
							>
								<CombineIcon />
							</ToolbarButton>
						)}
						{canSplit && (
							<ToolbarButton
								tooltip={t.table_node_split_cell}
								onClick={() => tf.table.split()}
								onMouseDown={(e) => e.preventDefault()}
							>
								<SquareSplitHorizontalIcon />
							</ToolbarButton>
						)}

						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<ToolbarButton tooltip={t.table_node_cell_borders}>
									<Grid2X2Icon />
								</ToolbarButton>
							</DropdownMenuTrigger>

							<DropdownMenuPortal>
								<TableBordersDropdownMenuContent />
							</DropdownMenuPortal>
						</DropdownMenu>

						{collapsed && (
							<ToolbarGroup>
								<ToolbarButton
									tooltip={t.table_node_delete_table}
									{...buttonProps}
								>
									<Trash2Icon />
								</ToolbarButton>
							</ToolbarGroup>
						)}
					</ToolbarGroup>

					{collapsed && (
						<ToolbarGroup>
							<ToolbarButton
								tooltip={t.table_node_insert_row_before}
								onClick={() => {
									tf.insert.tableRow({ before: true });
								}}
								onMouseDown={(e) => e.preventDefault()}
							>
								<ArrowUp />
							</ToolbarButton>
							<ToolbarButton
								tooltip={t.table_node_insert_row_after}
								onClick={() => {
									tf.insert.tableRow();
								}}
								onMouseDown={(e) => e.preventDefault()}
							>
								<ArrowDown />
							</ToolbarButton>
							<ToolbarButton
								tooltip={t.table_node_delete_row}
								onClick={() => {
									tf.remove.tableRow();
								}}
								onMouseDown={(e) => e.preventDefault()}
							>
								<XIcon />
							</ToolbarButton>
						</ToolbarGroup>
					)}

					{collapsed && (
						<ToolbarGroup>
							<ToolbarButton
								tooltip={t.table_node_insert_column_before}
								onClick={() => {
									tf.insert.tableColumn({ before: true });
								}}
								onMouseDown={(e) => e.preventDefault()}
							>
								<ArrowLeft />
							</ToolbarButton>
							<ToolbarButton
								tooltip={t.table_node_insert_column_after}
								onClick={() => {
									tf.insert.tableColumn();
								}}
								onMouseDown={(e) => e.preventDefault()}
							>
								<ArrowRight />
							</ToolbarButton>
							<ToolbarButton
								tooltip={t.table_node_delete_column}
								onClick={() => {
									tf.remove.tableColumn();
								}}
								onMouseDown={(e) => e.preventDefault()}
							>
								<XIcon />
							</ToolbarButton>
						</ToolbarGroup>
					)}
				</Toolbar>
			</PopoverContent>
		</Popover>
	);
}

function TableBordersDropdownMenuContent(
	props: React.ComponentProps<typeof DropdownMenuPrimitive.Content>
) {
	const editor = useEditorRef();
	const {
		getOnSelectTableBorder,
		hasBottomBorder,
		hasLeftBorder,
		hasNoBorders,
		hasOuterBorders,
		hasRightBorder,
		hasTopBorder
	} = useTableBordersDropdownMenuContentState();

	return (
		<DropdownMenuContent
			align="start"
			className="min-w-[220px]"
			side="right"
			sideOffset={0}
			onCloseAutoFocus={(e) => {
				e.preventDefault();
				editor.tf.focus();
			}}
			{...props}
		>
			<DropdownMenuGroup>
				<DropdownMenuCheckboxItem
					checked={hasTopBorder}
					onCheckedChange={getOnSelectTableBorder('top')}
				>
					<BorderTopIcon />
					<div>{t.table_node_top_border}</div>
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={hasRightBorder}
					onCheckedChange={getOnSelectTableBorder('right')}
				>
					<BorderRightIcon />
					<div>{t.table_node_right_border}</div>
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={hasBottomBorder}
					onCheckedChange={getOnSelectTableBorder('bottom')}
				>
					<BorderBottomIcon />
					<div>{t.table_node_bottom_border}</div>
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={hasLeftBorder}
					onCheckedChange={getOnSelectTableBorder('left')}
				>
					<BorderLeftIcon />
					<div>{t.table_node_left_border}</div>
				</DropdownMenuCheckboxItem>
			</DropdownMenuGroup>

			<DropdownMenuGroup>
				<DropdownMenuCheckboxItem
					checked={hasNoBorders}
					onCheckedChange={getOnSelectTableBorder('none')}
				>
					<BorderNoneIcon />
					<div>{t.table_node_no_border}</div>
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={hasOuterBorders}
					onCheckedChange={getOnSelectTableBorder('outer')}
				>
					<BorderAllIcon />
					<div>{t.table_node_outside_borders}</div>
				</DropdownMenuCheckboxItem>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	);
}

function ColorDropdownMenu({
	children,
	tooltip
}: Readonly<{
	children: React.ReactNode;
	tooltip: string;
}>) {
	const [open, setOpen] = React.useState(false);

	const editor = useEditorRef();
	const selectedCells = usePluginOption(TablePlugin, 'selectedCells');

	const onUpdateColor = React.useCallback(
		(color: string) => {
			setOpen(false);
			setCellBackground(editor, { color, selectedCells: selectedCells ?? [] });
		},
		[selectedCells, editor]
	);

	const onClearColor = React.useCallback(() => {
		setOpen(false);
		setCellBackground(editor, {
			color: null,
			selectedCells: selectedCells ?? []
		});
	}, [selectedCells, editor]);

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton tooltip={tooltip}>{children}</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start">
				<ToolbarMenuGroup label={t.table_node_colors}>
					<ColorDropdownMenuItems
						className="px-2"
						colors={DEFAULT_COLORS}
						updateColor={onUpdateColor}
					/>
				</ToolbarMenuGroup>
				<DropdownMenuGroup>
					<DropdownMenuItem className="p-2" onClick={onClearColor}>
						<EraserIcon />
						<span>{t.table_node_clear}</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function TableRowElement(props: PlateElementProps<TTableRowElement>) {
	const { element } = props;
	const readOnly = useReadOnly();
	const selected = useSelected();
	const editor = useEditorRef();
	const isSelectionAreaVisible = usePluginOption(
		BlockSelectionPlugin,
		'isSelectionAreaVisible'
	);
	const hasControls = !readOnly && !isSelectionAreaVisible;

	const { isDragging, previewRef, handleRef } = useDraggable({
		element,
		type: element.type,
		canDropNode: ({ dragEntry, dropEntry }) =>
			PathApi.equals(
				PathApi.parent(dragEntry[1]),
				PathApi.parent(dropEntry[1])
			),
		onDropHandler: (_, { dragItem }) => {
			const dragElement = (dragItem as { element: TElement }).element;

			if (dragElement) {
				editor.tf.select(dragElement);
			}
		}
	});

	return (
		<PlateElement
			{...props}
			ref={useComposedRef(props.ref, previewRef)}
			as="tr"
			attributes={{
				...props.attributes,
				'data-selected': selected ? 'true' : undefined
			}}
			className={cn('group/row', isDragging && 'opacity-50')}
		>
			{hasControls && (
				<td className="w-2 select-none" contentEditable={false}>
					<RowDragHandle dragRef={handleRef} />
					<RowDropLine />
				</td>
			)}

			{props.children}
		</PlateElement>
	);
}

function RowDragHandle({ dragRef }: { dragRef: React.Ref<HTMLButtonElement> }) {
	const editor = useEditorRef();
	const element = useElement();

	return (
		<Button
			ref={dragRef}
			className={cn(
				'absolute top-1/2 left-0 z-51 h-6 w-4 -translate-y-1/2 p-0 focus-visible:ring-0 focus-visible:ring-offset-0',
				'cursor-grab active:cursor-grabbing',
				'opacity-0 transition-opacity duration-100 group-hover/row:opacity-100 group-has-data-[resizing="true"]/row:opacity-0'
			)}
			variant="outline"
			onClick={() => {
				editor.tf.select(element);
			}}
		>
			<GripVertical className="text-muted-foreground" />
		</Button>
	);
}

function RowDropLine() {
	const { dropLine } = useDropLine();

	if (!dropLine) return null;

	return (
		<div
			className={cn(
				'absolute inset-x-0 left-2 z-50 h-0.5 bg-brand/50',
				dropLine === 'top' ? '-top-px' : '-bottom-px'
			)}
		/>
	);
}

export function TableCellElement({
	isHeader,
	...props
}: PlateElementProps<TTableCellElement> & {
	isHeader?: boolean;
}) {
	const { api } = useEditorPlugin(TablePlugin);
	const readOnly = useReadOnly();
	const element = props.element;

	const rowId = useElementSelector(([node]) => node.id as string, [], {
		key: KEYS.tr
	});
	const isSelectingRow = useBlockSelected(rowId);
	const isSelectionAreaVisible = usePluginOption(
		BlockSelectionPlugin,
		'isSelectionAreaVisible'
	);

	const { borders, colIndex, colSpan, minHeight, rowIndex, selected, width } =
		useTableCellElement();

	const { bottomProps, hiddenLeft, leftProps, rightProps } =
		useTableCellElementResizable({
			colIndex,
			colSpan,
			rowIndex
		});

	return (
		<PlateElement
			{...props}
			as={isHeader ? 'th' : 'td'}
			attributes={{
				...props.attributes,
				colSpan: api.table.getColSpan(element),
				rowSpan: api.table.getRowSpan(element)
			}}
			className={cn(
				'h-full overflow-visible border-none bg-background p-0',
				element.background ? 'bg-(--cellBackground)' : 'bg-background',
				isHeader && 'text-left *:m-0',
				'before:size-full',
				selected && 'before:z-10 before:bg-brand/5',
				"before:absolute before:box-border before:content-[''] before:select-none",
				borders.bottom?.size && `before:border-b before:border-b-border`,
				borders.right?.size && `before:border-r before:border-r-border`,
				borders.left?.size && `before:border-l before:border-l-border`,
				borders.top?.size && `before:border-t before:border-t-border`
			)}
			style={
				{
					'--cellBackground': element.background,
					maxWidth: width || 240,
					minWidth: width || 120
				} as React.CSSProperties
			}
		>
			<div
				className="relative z-20 box-border h-full px-3 py-2"
				style={{ minHeight }}
			>
				{props.children}
			</div>

			{!isSelectionAreaVisible && (
				<div
					className="group absolute top-0 size-full select-none"
					contentEditable={false}
					suppressContentEditableWarning={true}
				>
					{!readOnly && (
						<>
							<ResizeHandle
								{...rightProps}
								className="-top-2 -right-1 h-[calc(100%_+_8px)] w-2"
								data-col={colIndex}
							/>
							<ResizeHandle {...bottomProps} className="-bottom-1 h-2" />
							{!hiddenLeft && (
								<ResizeHandle
									{...leftProps}
									className="top-0 -left-1 w-2"
									data-resizer-left={colIndex === 0 ? 'true' : undefined}
								/>
							)}

							<div
								className={cn(
									'absolute top-0 z-30 hidden h-full w-1 bg-ring',
									'right-[-1.5px]',
									columnResizeVariants({
										colIndex: colIndex as
											| 0
											| 2
											| 1
											| 3
											| 4
											| 5
											| 6
											| 7
											| 8
											| 9
											| 10
											| null
											| undefined
									})
								)}
							/>
							{colIndex === 0 && (
								<div
									className={cn(
										'absolute top-0 z-30 h-full w-1 bg-ring',
										'left-[-1.5px]',
										'hidden animate-in fade-in group-has-[[data-resizer-left]:hover]/table:block group-has-[[data-resizer-left][data-resizing="true"]]/table:block'
									)}
								/>
							)}
						</>
					)}
				</div>
			)}

			{isSelectingRow && (
				<div className={blockSelectionVariants()} contentEditable={false} />
			)}
		</PlateElement>
	);
}

export function TableCellHeaderElement(
	props: React.ComponentProps<typeof TableCellElement>
) {
	return <TableCellElement {...props} isHeader />;
}

const columnResizeVariants = cva('hidden animate-in fade-in', {
	variants: {
		colIndex: {
			0: 'group-has-[[data-col="0"]:hover]/table:block group-has-[[data-col="0"][data-resizing="true"]]/table:block',
			1: 'group-has-[[data-col="1"]:hover]/table:block group-has-[[data-col="1"][data-resizing="true"]]/table:block',
			2: 'group-has-[[data-col="2"]:hover]/table:block group-has-[[data-col="2"][data-resizing="true"]]/table:block',
			3: 'group-has-[[data-col="3"]:hover]/table:block group-has-[[data-col="3"][data-resizing="true"]]/table:block',
			4: 'group-has-[[data-col="4"]:hover]/table:block group-has-[[data-col="4"][data-resizing="true"]]/table:block',
			5: 'group-has-[[data-col="5"]:hover]/table:block group-has-[[data-col="5"][data-resizing="true"]]/table:block',
			6: 'group-has-[[data-col="6"]:hover]/table:block group-has-[[data-col="6"][data-resizing="true"]]/table:block',
			7: 'group-has-[[data-col="7"]:hover]/table:block group-has-[[data-col="7"][data-resizing="true"]]/table:block',
			8: 'group-has-[[data-col="8"]:hover]/table:block group-has-[[data-col="8"][data-resizing="true"]]/table:block',
			9: 'group-has-[[data-col="9"]:hover]/table:block group-has-[[data-col="9"][data-resizing="true"]]/table:block',
			10: 'group-has-[[data-col="10"]:hover]/table:block group-has-[[data-col="10"][data-resizing="true"]]/table:block'
		}
	}
});
