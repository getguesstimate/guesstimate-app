import React, { Component } from "react";

import { ConnectDropTarget, useDrop } from "react-dnd";

import { EmptyCell } from "./EmptyCell";
import { FilledCell } from "./FilledCell";

import clsx from "clsx";
import { CanvasLocation, Direction } from "~/lib/locationUtils";
import { CanvasState } from "~/modules/canvas_state/slice";
import { GridItem } from "./types";

type CollectedProps = {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
};

type OwnProps = {
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
type Props = OwnProps & CollectedProps;

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

class Cell extends Component<Props> {
  itemRef: React.RefObject<{ focus(): void }>;

  constructor(props: Props) {
    super(props);
    this.itemRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.inSelectedCell) {
      this._focus();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (!!prevProps.item !== !!this.props.item ||
        !!prevProps.inSelectedCell !== !!this.props.inSelectedCell) &&
      this.props.inSelectedCell
    ) {
      this._focus();
    }
  }

  _focus() {
    this.itemRef.current?.focus();
  }

  render() {
    const { inSelectedRegion, item, isOver, isHovered } = this.props;

    const handleAutoFillTargetMouseDown = (e: React.MouseEvent) => {
      if (e.button === 0) {
        this.props.onAutoFillTargetMouseDown();
        e.preventDefault();
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      // TODO(matthew): I think we can refactor this and get rid of the window trigger system for doing this input, but it
      // will be a bigger refactor, so I'm inclined to leave this for now, even though it couples the flow grid and the
      // space more tightly than they've been integrated so far.
      const isFunctionSelect =
        this.props.canvasState.metricClickMode === "FUNCTION_INPUT_SELECT";
      const { inSelectedCell, item, location } = this.props;
      const leftClick = e.button === 0;

      if (!leftClick) {
        return;
      }

      if (!item) {
        this.props.onEmptyCellMouseDown(e);
      }

      if (inSelectedCell) {
        if (!item) {
          this.props.onAddItem(location);
        }
        this.props.handleSelect(location);
      }

      if (!inSelectedCell) {
        if (e.shiftKey) {
          this.props.handleEndRangeSelect(this.props.location);
          return;
        } else if (isFunctionSelect && item) {
          return;
        } else {
          this.props.handleSelect(location);
        }
      }
    };

    const cellElement = this.props.item ? (
      // Then endDrag fixes a bug where the original dragging position is hovered.
      <FilledCell
        {...this.props}
        item={this.props.item} // typescript fix
        onEndDrag={this.props.onEndDragCell}
        forceFlowGridUpdate={this.props.forceFlowGridUpdate}
        hover={this.props.isHovered}
        ref={this.itemRef}
      />
    ) : (
      <EmptyCell {...this.props} ref={this.itemRef} />
    );

    const className = clsx(
      "FlowGridCell",
      inSelectedRegion ? "selected" : "nonSelected",
      item && "hasItem",
      isOver && "IsOver",
      isHovered && "hovered"
    );

    return (
      <div
        ref={this.props.connectDropTarget}
        className={className}
        onMouseEnter={this.props.onMouseEnter}
        onMouseDown={handleMouseDown}
        onMouseUp={this.props.onMouseUp}
      >
        {cellElement}
        {this.props.showAutoFillToken && (
          <div className="AutoFillToken--outer">
            <div
              className="AutoFillToken"
              onMouseDown={handleAutoFillTargetMouseDown}
            />
          </div>
        )}
      </div>
    );
  }
}

export const DropCell: React.FC<OwnProps> = (props) => {
  const [collectedProps, drop] = useDrop({
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

  return <Cell {...props} {...collectedProps} connectDropTarget={drop} />;
};
