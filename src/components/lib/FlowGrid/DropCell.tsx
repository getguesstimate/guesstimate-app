import React, { FC, useContext, useEffect, useRef } from "react";

import clsx from "clsx";
import { useDrop } from "react-dnd";
import { CanvasLocation, Direction } from "~/lib/locationUtils";

import { EmptyCell } from "./EmptyCell";
import { FilledCell } from "./FilledCell";
import { cellSizeInfo, FlowGridContext } from "./FlowGrid";
import { GridItem } from "./types";

type Props = {
  inSelectedCell: boolean;
  isHovered: boolean;
  showAutoFillToken: boolean;
  handleSelect(location: CanvasLocation, direction?: any): void;
  handleEndRangeSelect(location: CanvasLocation): void;
  item?: GridItem;
  location: CanvasLocation;
  onAddItem(location: CanvasLocation): void;
  onMoveItem(arg: { prev: CanvasLocation; next: CanvasLocation }): void;
  onEndDragCell(location: CanvasLocation): void;
  forceFlowGridUpdate(): void;
  onEmptyCellMouseDown(e: React.MouseEvent): void;
  onMouseEnter(e: React.MouseEvent): void;
  onMouseUp(e: React.MouseEvent): void;
  onAutoFillTargetMouseDown(): void;
  onReturn(): void;
  onTab(): void;
  selectedFrom?: Direction;
  getRowHeight(): number;
};

// Provides drag&drop capabilities and renders either FilledCell or EmtpyCell as a child.
export const DropCell: FC<Props> = (props) => {
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
      return { location: props.location, item: props.item };
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

  const handleAutoFillTargetMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      props.onAutoFillTargetMouseDown();
      e.preventDefault();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log("dropcell", e);
    const { inSelectedCell, item, location } = props;

    const leftClick = e.button === 0;
    if (!leftClick) {
      return;
    }

    if (!item) {
      props.onEmptyCellMouseDown(e);
    }

    if (inSelectedCell) {
      props.handleSelect(location);
    } else {
      if (e.shiftKey) {
        props.handleEndRangeSelect(props.location);
        return;
      } else {
        props.handleSelect(location);
      }
    }
  };

  const cellElement = props.item ? (
    <FilledCell
      ref={itemRef}
      {...props}
      item={props.item} // typescript fix
      onEndDrag={props.onEndDragCell} // Then endDrag fixes a bug where the original dragging position is hovered.
      forceFlowGridUpdate={props.forceFlowGridUpdate}
    />
  ) : (
    <EmptyCell ref={itemRef} {...props} isOver={isOver} />
  );

  return (
    <div
      ref={connectDropTarget}
      className={clsx(
        "group/gridcell",
        "min-h-[60px] relative grid flex-none place-items-stretch",
        showGridLines &&
          "border-[rgb(0,25,95)]/[0.09] border-r border-b border-dashed",
        cellSizeInfo[size].classNames
      )}
      onMouseEnter={props.onMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseUp={props.onMouseUp}
    >
      {cellElement}
      {props.showAutoFillToken && (
        <div className="p-[0.8em] transition-[padding] duration-[50ms] absolute -right-5 -bottom-5 z-10 h-9 w-9 hover:p-2">
          <div
            className="bg-[rgb(90,141,177)] h-full w-full cursor-crosshair rounded-sm"
            onMouseDown={handleAutoFillTargetMouseDown}
          />
        </div>
      )}
    </div>
  );
};
