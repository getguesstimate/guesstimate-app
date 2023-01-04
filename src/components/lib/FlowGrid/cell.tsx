import React, { Component } from "react";
import ReactDOM from "react-dom";

import { ConnectDropTarget, useDrop } from "react-dnd";

import EmptyCell from "./cell-empty";
import ItemCell, { InnerItemCell } from "./filled-cell";

import { getClassName } from "~/lib/engine/utils";
import { Location } from "~/lib/locationUtils";
import { CanvasState, GridItem } from "./types";

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
  handleSelect(location: Location, direction?: any): void;
  handleEndRangeSelect(location: Location): void;
  item?: GridItem;
  location: Location;
  onAddItem(location: Location): void;
  onMoveItem(arg: { prev: Location; next: Location }): void;
  hasItemUpdated(oldItem: GridItem, newItem: GridItem): boolean;
  onEndDragCell(location: Location): void;
  forceFlowGridUpdate(): void;
  onEmptyCellMouseDown(e: React.MouseEvent): void;
  onMouseEnter(e: React.MouseEvent): void;
  onMouseUp(e: React.MouseEvent): void;
  gridKeyPress(e: React.KeyboardEvent): void;
  onAutoFillTargetMouseDown(): void;
  onReturn(): void;
  onTab(): void;
  selectedFrom?: "UP" | "DOWN" | "LEFT" | "RIGHT";
  getRowHeight(): number;
};
type Props = OwnProps & CollectedProps;

class Cell extends Component<Props> {
  itemRef: React.RefObject<InnerItemCell>;

  constructor(props: Props) {
    super(props);
    this.itemRef = React.createRef();
  }

  shouldComponentUpdate(newProps: Props) {
    const difProps =
      newProps.isOver !== this.props.isOver ||
      newProps.inSelectedRegion !== this.props.inSelectedRegion ||
      newProps.inSelectedCell !== this.props.inSelectedCell ||
      newProps.isHovered !== this.props.isHovered ||
      newProps.showAutoFillToken !== this.props.showAutoFillToken;
    const itemDifferent = !!newProps.item !== !!this.props.item;

    return (
      difProps ||
      itemDifferent ||
      (!!newProps.item &&
        !!this.props.item &&
        this.props.hasItemUpdated(this.props.item, newProps.item))
    );
  }

  componentWillUpdate() {
    window.recorder.recordRenderStartEvent(this);
  }
  componentWillUnmount() {
    window.recorder.recordUnmountEvent(this);
  }

  componentDidUpdate(prevProps: Props) {
    window.recorder.recordRenderStopEvent(this);
    if (
      (!!prevProps.item !== !!this.props.item ||
        !!prevProps.inSelectedCell !== !!this.props.inSelectedCell) &&
      this.props.inSelectedCell
    ) {
      this._focus();
    }
  }

  handleMouseDown(e: React.MouseEvent) {
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
  }

  componentDidMount() {
    if (this.props.inSelectedCell) {
      this._focus();
    }
    window.recorder.recordMountEvent(this);
  }

  _focus() {
    if (this.itemRef.current) {
      // Always focus on the immediate child of the filled cell.
      this.itemRef.current.focus();
    } else {
      (ReactDOM.findDOMNode(this.refs.empty) as any)?.focus();
    }
  }

  _cellElement() {
    if (this.props.item) {
      // Then endDrag fixes a bug where the original dragging position is hovered.
      return (
        <ItemCell
          {...this.props}
          item={this.props.item} // typescript fix
          onEndDrag={this.props.onEndDragCell}
          forceFlowGridUpdate={this.props.forceFlowGridUpdate}
          hover={this.props.isHovered}
          ref={this.itemRef}
        />
      );
    } else {
      return <EmptyCell {...this.props} ref="empty" />;
    }
  }

  onAutoFillTargetMouseDown(e: React.MouseEvent) {
    if (e.button === 0) {
      this.props.onAutoFillTargetMouseDown();
      e.preventDefault();
    }
  }

  render() {
    const { inSelectedRegion, item, isOver, isHovered } = this.props;

    const className = getClassName(
      "FlowGridCell",
      inSelectedRegion ? "selected" : "nonSelected",
      item ? "hasItem" : null,
      isOver ? "IsOver" : null,
      isHovered ? "hovered" : null
    );
    return (
      <div
        ref={this.props.connectDropTarget}
        className={className}
        onMouseEnter={this.props.onMouseEnter}
        onMouseDown={this.handleMouseDown.bind(this)}
        onMouseUp={this.props.onMouseUp}
      >
        {this._cellElement()}
        {this.props.showAutoFillToken && (
          <div className="AutoFillToken--outer">
            <div
              className="AutoFillToken"
              onMouseDown={this.onAutoFillTargetMouseDown.bind(this)}
            />
          </div>
        )}
      </div>
    );
  }
}

const DropCell: React.FC<OwnProps> = (props) => {
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

export default DropCell;
