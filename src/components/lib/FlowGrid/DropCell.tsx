import React, { Component, useContext, useEffect, useRef } from "react";

import { ConnectDropTarget, useDrop } from "react-dnd";

import { EmptyCell } from "./EmptyCell";
import { FilledCell } from "./FilledCell";

import clsx from "clsx";
import { CanvasLocation, Direction } from "~/lib/locationUtils";
import { CanvasState } from "~/modules/canvas_state/slice";
import { GridItem } from "./types";
import { cellSizeInfo, FlowGridContext } from "./FlowGrid";

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

// shouldComponentUpdate(newProps: Props) {
//   const difProps =
//     newProps.isOver !== this.props.isOver ||
//     newProps.inSelectedRegion !== this.props.inSelectedRegion ||
//     newProps.inSelectedCell !== this.props.inSelectedCell ||
//     newProps.isHovered !== this.props.isHovered ||
//     newProps.showAutoFillToken !== this.props.showAutoFillToken;
//   const itemDifferent = !!newProps.item !== !!this.props.item;

//   return (
//     difProps ||
//     itemDifferent ||
//     (!!newProps.item &&
//       !!this.props.item &&
//       this.props.hasItemUpdated(this.props.item, newProps.item))
//   );
// }

export const DropCell: React.FC<Props> = (props) => {
  const itemRef = useRef<{ focus(): void }>(null);

  const { size } = useContext(FlowGridContext);

  const { showGridLines } = useContext(FlowGridContext);

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

  useEffect(() => {
    if (props.inSelectedCell) {
      itemRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (props.inSelectedCell) {
      itemRef.current?.focus();
    }
  }, [props.inSelectedCell]);

  const { inSelectedRegion, item, isHovered } = props;

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
    }

    if (!inSelectedCell) {
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

  const cellElement = item ? (
    // Then endDrag fixes a bug where the original dragging position is hovered.
    <FilledCell
      {...props}
      item={item} // typescript fix
      onEndDrag={props.onEndDragCell}
      forceFlowGridUpdate={props.forceFlowGridUpdate}
      focusCell={() => itemRef.current?.focus()}
      ref={itemRef}
    />
  ) : (
    <EmptyCell {...props} ref={itemRef} isOver={isOver} />
  );

  const className = clsx(
    "group/gridcell",
    "flex-none min-h-[60px] relative grid place-items-stretch",
    showGridLines &&
      "border-r border-b border-[rgb(0,25,95)]/[0.09] border-dashed",
    cellSizeInfo[size].classNames
  );

  return (
    <div
      ref={connectDropTarget}
      className={className}
      onMouseEnter={props.onMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseUp={props.onMouseUp}
    >
      {cellElement}
      {props.showAutoFillToken && (
        <div className="absolute -right-5 -bottom-5 w-9 h-9 z-10 transition-[padding] duration-[50ms] p-[0.8em] hover:p-2">
          <div
            className="cursor-crosshair w-full h-full rounded-sm bg-[rgb(90,141,177)]"
            onMouseDown={handleAutoFillTargetMouseDown}
          />
        </div>
      )}
    </div>
  );
};
