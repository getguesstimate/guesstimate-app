import React, { FC, useContext, useEffect, useRef } from "react";

import clsx from "clsx";
import { useDrop } from "react-dnd";
import { CanvasLocation, Direction } from "~/lib/locationUtils";
import { CanvasState } from "~/modules/canvas_state/slice";

import { EmptyCell } from "./EmptyCell";
import { FilledCell } from "./FilledCell";
import { cellSizeInfo, FlowGridContext } from "./FlowGrid";
import { GridItem } from "./types";

type Props = {
  canvasState: CanvasState;
  inSelectedRegion: boolean;
  inSelectedCell: boolean;
  isHovered: boolean;
  showAutoFillToken: boolean;
  handleSelect(location: CanvasLocation, direction?: any): void;
  handleEndRangeSelect(location: CanvasLocation): void;
  item?: GridItem;
  location: CanvasLocation;
  onAddItem(location: CanvasLocation): void;
  onMoveItem(arg: { prev: CanvasLocation; next: CanvasLocation }): void;
  hasItemUpdated(oldItem: GridItem, newItem: GridItem): boolean;
  onEndDragCell(location: CanvasLocation): void;
  forceFlowGridUpdate(): void;
  onEmptyCellMouseDown(e: React.MouseEvent): void;
  onMouseEnter(e: React.MouseEvent): void;
  onMouseUp(e: React.MouseEvent): void;
  gridKeyPress(e: React.KeyboardEvent): void;
  onAutoFillTargetMouseDown(): void;
  onReturn(): void;
  onTab(): void;
  selectedFrom?: Direction;
  getRowHeight(): number;
};

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
  }, [props.inSelectedCell]);

  const handleAutoFillTargetMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      props.onAutoFillTargetMouseDown();
      e.preventDefault();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // TODO(matthew): I think we can refactor this and get rid of the window trigger system for doing this input, but it
    // will be a bigger refactor, so I'm inclined to leave this for now, even though it couples the flow grid and the
    // space more tightly than they've been integrated so far.
    const isFunctionSelect =
      props.canvasState.metricClickMode === "FUNCTION_INPUT_SELECT";
    const { inSelectedCell, item, location } = props;

    const leftClick = e.button === 0;
    if (!leftClick) {
      return;
    }

    if (!item) {
      props.onEmptyCellMouseDown(e);
    }

    if (inSelectedCell) {
      if (!item) {
        props.onAddItem(location);
      }
      props.handleSelect(location);
    } else {
      if (e.shiftKey) {
        props.handleEndRangeSelect(props.location);
        return;
      } else if (isFunctionSelect && item) {
        return;
      } else {
        props.handleSelect(location);
      }
    }
  };

  const cellElement = props.item ? (
    // Then endDrag fixes a bug where the original dragging position is hovered.
    <FilledCell
      {...props}
      item={props.item} // typescript fix
      onEndDrag={props.onEndDragCell}
      forceFlowGridUpdate={props.forceFlowGridUpdate}
      focusCell={() => itemRef.current?.focus()}
      ref={itemRef}
    />
  ) : (
    <EmptyCell {...props} ref={itemRef} isOver={isOver} />
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
      onMouseEnter={props.onMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseUp={props.onMouseUp}
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
};
