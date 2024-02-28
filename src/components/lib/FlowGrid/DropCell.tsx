import React, {
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import clsx from "clsx";
import { useDrop } from "react-dnd";
import { CanvasLocation, Direction } from "~/lib/locationUtils";

import { EmptyCell } from "./EmptyCell";
import { FilledCell } from "./FilledCell";
import { cellSizeInfo, FlowGridContext } from "./FlowGrid";
import { GridItem } from "./types";

type Props = {
  // we're passing `row` and `column` instead of `location` to use the default `memo()` equality check
  row: number;
  column: number;
  item?: GridItem;
  isHovered: boolean;
  inSelectedCell: boolean;
  selectedFrom?: Direction;
  showAutoFillToken: boolean;
  onAddItem(location: CanvasLocation): void;
  onMoveItem(arg: { prev: CanvasLocation; next: CanvasLocation }): void;
  onSelect(location: CanvasLocation, direction?: any): void;
  onEndRangeSelect(location: CanvasLocation): void;
  onEndDragCell(location: CanvasLocation): void;
  onMouseEnter(location: CanvasLocation): void;
  onEmptyCellMouseDown(e: React.MouseEvent): void;
  onAutoFillTargetMouseDown(location: CanvasLocation): void;
  onReturn(location: CanvasLocation, down?: boolean): void;
  onTab(location: CanvasLocation, right?: boolean): void;
  forceFlowGridUpdate(): void;
  getRowHeight(rowI: number): number;
};

// Provides drag&drop capabilities and renders either FilledCell or EmtpyCell as a child.
export const DropCell: FC<Props> = memo(function DropCell(props) {
  const location = useMemo<CanvasLocation>(
    () => ({
      row: props.row,
      column: props.column,
    }),
    [props.row, props.column]
  );

  const itemRef = useRef<{ focus(): void }>(null);

  const { size, showGridLines } = useContext(FlowGridContext);

  const [{ isOver }, connectDropTarget] = useDrop({
    accept: "card",
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
    drop() {
      return { location, item: props.item };
    },
  });

  // Self-focus on render; TODO - is there a better solution?
  useEffect(() => {
    if (props.inSelectedCell) {
      itemRef.current?.focus();
    }
  }, [
    props.inSelectedCell,
    // When item is pasted or deleted, `itemRef` changes, so we have to call its
    // `focus()` again, even if `inSelectedCell` hasn't changed.
    !!props.item,
  ]);

  const handleMouseEnter = useCallback(
    () => props.onMouseEnter(location),
    [location, props.onMouseEnter]
  );

  const handleAutoFillTargetMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      props.onAutoFillTargetMouseDown(location);
      e.preventDefault();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { inSelectedCell, item } = props;

    const leftClick = e.button === 0;
    if (!leftClick) {
      return;
    }

    if (!item) {
      props.onEmptyCellMouseDown(e);
    }

    if (inSelectedCell) {
      props.onSelect(location);
    } else {
      if (e.shiftKey) {
        props.onEndRangeSelect(location);
      } else {
        props.onSelect(location);
      }
    }
  };

  const handleReturn = useCallback(
    (down = true) => {
      props.onReturn(location, down);
    },
    [location, props.onReturn]
  );

  const handleTab = useCallback(
    (right = true) => {
      props.onTab(location, right);
    },
    [location, props.onTab]
  );

  const getRowHeight = useCallback(
    () => props.getRowHeight(location.row),
    [props.getRowHeight, location.row]
  );

  const cellElement = props.item ? (
    <FilledCell
      ref={itemRef}
      item={props.item}
      location={location}
      isHovered={props.isHovered}
      inSelectedCell={props.inSelectedCell}
      selectedFrom={props.selectedFrom}
      onMoveItem={props.onMoveItem}
      onEndDrag={props.onEndDragCell} // Then endDrag fixes a bug where the original dragging position is hovered.
      onReturn={handleReturn}
      onTab={handleTab}
      forceFlowGridUpdate={props.forceFlowGridUpdate}
      getRowHeight={getRowHeight}
    />
  ) : (
    <EmptyCell
      ref={itemRef}
      location={location}
      isHovered={props.isHovered}
      inSelectedCell={props.inSelectedCell}
      isOver={isOver}
      onAddItem={props.onAddItem}
    />
  );

  return (
    <div
      ref={connectDropTarget}
      className={clsx(
        "group/gridcell",
        "relative grid min-h-[60px] flex-none place-items-stretch",
        showGridLines &&
          "border-r border-b border-dashed border-[rgb(0,25,95)]/[0.09]",
        cellSizeInfo[size].classNames
      )}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
    >
      {cellElement}
      {props.showAutoFillToken && (
        <div className="absolute -right-5 -bottom-5 z-10 h-9 w-9 p-[0.8em] transition-[padding] duration-[50ms] hover:p-2">
          <div
            className="h-full w-full cursor-crosshair rounded-sm bg-[rgb(90,141,177)]"
            onMouseDown={handleAutoFillTargetMouseDown}
          />
        </div>
      )}
    </div>
  );
});
