import _ from "lodash";
import React, { Component } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { BackgroundContainer } from "./background-container";
import Cell from "./cell";

import { SelectedCellState } from "~/modules/selected_cell/reducer";
import {
  boundingRegion,
  getBounds,
  isAtLocation,
  isLocation,
  isWithinRegion,
  Location,
  MaybeRegion,
} from "~/lib/locationUtils";
import { CanvasState, GridItem } from "./types";
import { DirectionToLocation, keycodeToDirection } from "./utils";
import { EdgeShape } from "~/components/spaces/canvas";

const upto = (n: number): number[] =>
  Array.apply(null, { length: n }).map(Number.call, Number);

//It would be better to have this as state, but we don't want this to cause renders.
let lastMousePosition = { pageX: 0, pageY: 0 };

type Props = {
  canvasState: CanvasState;
  onUndo(): void;
  onRedo(): void;
  items: GridItem[];
  edges: EdgeShape[];
  selectedCell: SelectedCellState;
  selectedRegion: MaybeRegion;
  copiedRegion: MaybeRegion;
  analyzedRegion: MaybeRegion;
  onSelectItem(location: Location, direction?: any): void;
  onMultipleSelect(corner1: Location, corner2: Location): void;
  onAutoFillRegion(autoFillRegion: any): void;
  onDeSelectAll(): void;
  onAddItem(location: Location): void;
  onMoveItem(arg: { prev: Location; next: Location }): void;
  hasItemUpdated(oldItem: GridItem, newItem: GridItem): boolean;
  showGridLines: boolean;
  isModelingCanvas?: boolean;
  onRemoveItems(ids: string[]): void;
  onCut?(): void;
  onCopy?(): void;
  onPaste?(): void;
  isItemEmpty(id: string): boolean;
};

type State = {
  hover?: Location;
  dragSelecting?: boolean;
  ctrlPressed?: boolean;
} & (
  | {
      tracingAutoFillRegion: true;
      autoFillRegion: {
        start: Location;
        end?: Location;
      };
    }
  | {
      tracingAutoFillRegion: false;
      autoFillRegion: {
        start?: Location;
        end?: Location;
      };
    }
);

export default class FlowGrid extends Component<Props, State> {
  static defaultProps = {
    showGridLines: true,
    isModelingCanvas: true,
  };

  state: State = {
    hover: { row: -1, column: -1 }, // An impossible location means nothing hovered.
    tracingAutoFillRegion: false,
    autoFillRegion: {},
  };

  _handleMouseLeave() {
    window.recorder.recordNamedEvent("FlowGrid set hover state");
    this.setState({
      hover: { row: -1, column: -1 },
      dragSelecting: false,
      tracingAutoFillRegion: false,
      autoFillRegion: {},
    });
  }

  _handleMouseUp(e: React.MouseEvent) {
    if (e.button === 0) {
      window.recorder.recordNamedEvent("FlowGrid set left down state");
      this.setState({ dragSelecting: false });
    }
  }

  _handleEmptyCellMouseDown(e: React.MouseEvent, location: Location) {
    if (
      e.button === 0 &&
      !(e.target && (e.target as any).type === "textarea")
    ) {
      window.recorder.recordNamedEvent("FlowGrid set left down state");
      this.setState({ dragSelecting: true });
      lastMousePosition = _.pick(e, "pageX", "pageY");
      e.preventDefault();
    }
  }

  _mouseMoved(e: React.MouseEvent) {
    const sameLocation =
      e.pageX === lastMousePosition.pageX &&
      e.pageY === lastMousePosition.pageY;
    return !sameLocation;
  }

  newAutoFillRegion(location: Location) {
    const {
      autoFillRegion: { start },
    } = this.state;

    if (!start) {
      return {}; // shouldn't happen, this is called only when tracingAutoFillRegion is true
    }

    // The fill region should fill either the width of the rectangle between start & location or the height, whichever
    // is larger.
    const width = Math.abs(location.column - start.column);
    const height = Math.abs(location.row - start.row);

    // If the width is larger, the new end will span to the column of the end location, within the starting row.
    // Otherwise, it will span to the row of the final location, within the starting column.
    const end =
      width > height
        ? { row: start.row, column: location.column }
        : { row: location.row, column: start.column };

    return { start, end };
  }

  _handleCellMouseEnter(location: Location, e: React.MouseEvent) {
    window.recorder.recordNamedEvent("FlowGrid set hover state");
    // If this mouse hasn't moved, or the user is neither tracing a fill region or dragging a selected region, just set
    // the hover state.
    const user_dragging_selection =
      this.state.tracingAutoFillRegion || this.state.dragSelecting;
    if (!(this._mouseMoved(e) && user_dragging_selection)) {
      this.setState({ hover: location });
      return;
    }
    const hover = { row: -1, column: -1 };

    if (this.state.tracingAutoFillRegion) {
      window.recorder.recordNamedEvent("FlowGrid set autoFillRegion state");
      const autoFillRegion = this.newAutoFillRegion(location);
      this.setState({ autoFillRegion, hover });
    } else if (this.state.dragSelecting) {
      this._handleEndRangeSelect(location);
      this.setState({ hover });
    }
  }

  _handleEndDragCell(location: Location) {
    this._handleMouseLeave();
    this.props.onSelectItem(location);
  }

  _handleKeyUp(e: React.KeyboardEvent) {
    if (e.keyCode == 17 || e.keyCode == 224 || e.keyCode == 91) {
      window.recorder.recordNamedEvent("FlowGrid set ctrl pressed state");
      this.setState({ ctrlPressed: false });
    }
  }

  _selectedItems() {
    return this.props.items.filter((i) =>
      isWithinRegion(i.location, this.props.selectedRegion)
    );
  }

  _handleRemoveSelectedItems() {
    this.props.onRemoveItems(this._selectedItems().map((i) => i.key));
  }

  _handleKeyDown(e: React.KeyboardEvent) {
    if (e.target && (e.target as any).type === "textarea") {
      return;
    }
    if (e.keyCode === 8 || e.keyCode === 46) {
      this._handleRemoveSelectedItems();
      e.preventDefault();
    }

    const direction = keycodeToDirection(e.keyCode);
    if (direction && "row" in this.props.selectedCell) {
      e.preventDefault();
      const newLocation = new DirectionToLocation(
        this._size(),
        this.props.selectedCell
      )[direction]();
      this.props.onSelectItem(newLocation);
    } else if (
      !e.shiftKey &&
      (e.keyCode == 17 ||
        e.keyCode == 224 ||
        e.keyCode == 91 ||
        e.keyCode == 93)
    ) {
      e.preventDefault();
      window.recorder.recordNamedEvent("FlowGrid set ctrl pressed state");
      this.setState({ ctrlPressed: true });
    } else if (this.state.ctrlPressed) {
      if (e.keyCode == 86) {
        this.props.onPaste?.();
      } else if (e.keyCode == 67) {
        this.props.onCopy?.();
      } else if (e.keyCode == 88) {
        this.props.onCut?.();
      } else if (e.keyCode == 90 && !e.shiftKey) {
        this.props.onUndo();
        e.preventDefault();
      } else if (e.keyCode == 89 || (e.keyCode == 90 && e.shiftKey)) {
        this.props.onRedo();
        e.preventDefault();
      }
    }
  }

  _handleEndRangeSelect(corner1: Location) {
    const corner2 = this.props.selectedCell;

    if (!isLocation(corner2)) {
      this.props.onSelectItem(corner1);
      return;
    }

    this.props.onMultipleSelect(corner1, corner2);
  }

  _size() {
    const [_1, { row: largestRow, column: largestColumn }] = boundingRegion(
      this.props.items.map((e) => e.location)
    );
    let [selectedRow, selectedColumn] = [0, 0];
    if (isLocation(this.props.selectedCell)) {
      selectedRow = this.props.selectedCell.row;
      selectedColumn = this.props.selectedCell.column;
    }

    if (this.props.isModelingCanvas) {
      return {
        rows: Math.max(16, largestRow + 4, selectedRow + 5),
        columns: Math.max(10, largestColumn + 4, selectedColumn + 1),
      };
    } else {
      return {
        rows: Math.max(1, largestRow + 1),
        columns: Math.max(1, largestColumn + 1),
      };
    }
  }

  _addIfNeededAndSelect(location, direction) {
    if (!this.props.items.find((i) => isAtLocation(i.location, location))) {
      this.props.onAddItem(location);
    }
    this.props.onSelectItem(location, direction);
  }

  _onReturn(location: Location, isDown) {
    const { row, column } = location;
    const newRow = isDown ? row + 1 : (row || 1) - 1;
    const newLocation = { row: newRow, column };
    this._addIfNeededAndSelect(newLocation, isDown ? "UP" : "DOWN");
  }

  _onTab(location, isRight) {
    const { row, column } = location;
    const newCol = isRight ? column + 1 : (column || 1) - 1;
    const newLocation = { row, column: newCol };
    this._addIfNeededAndSelect(newLocation, isRight ? "LEFT" : "RIGHT");
  }

  onAutoFillTargetMouseDown(location: Location) {
    window.recorder.recordNamedEvent("FlowGrid set autoFillRegion state");
    this.setState({
      tracingAutoFillRegion: true,
      autoFillRegion: { start: location },
    });
  }

  onCellMouseUp(location: Location) {
    if (!this.state.tracingAutoFillRegion) {
      return;
    }
    window.recorder.recordNamedEvent("FlowGrid set autoFillRegion state");
    this.props.onAutoFillRegion(this.state.autoFillRegion);

    // FIXME - there might be typing bugs here but this is how it worked pre-typescript
    this._handleEndRangeSelect(this.state.autoFillRegion.end as any);

    this.setState({ tracingAutoFillRegion: false, autoFillRegion: {} });
  }

  // TODO(matthew): Look into necessity of 'inSelectedRegion' passed to cell below.
  _cell(location: Location) {
    const item = this.props.items.find((i) =>
      isAtLocation(i.location, location)
    );
    const { selectedCell, selectedRegion } = this.props;
    const inSelectedCell = isAtLocation(selectedCell, location);
    const selectedRegionNotOneByOne =
      selectedRegion.length === 2 &&
      !isAtLocation(selectedRegion[0], selectedRegion[1]);
    const hasNonEmptyItem = !!item && !this.props.isItemEmpty(item.key);
    const showAutoFillToken =
      inSelectedCell &&
      hasNonEmptyItem &&
      !this.state.dragSelecting &&
      !selectedRegionNotOneByOne;
    return (
      <Cell
        onMouseUp={() => {
          this.onCellMouseUp(location);
        }}
        onAutoFillTargetMouseDown={() => {
          this.onAutoFillTargetMouseDown(location);
        }}
        canvasState={this.props.canvasState}
        forceFlowGridUpdate={() => this.forceUpdate()}
        gridKeyPress={this._handleKeyDown.bind(this)}
        hasItemUpdated={this.props.hasItemUpdated}
        handleSelect={this.props.onSelectItem}
        handleEndRangeSelect={this._handleEndRangeSelect.bind(this)}
        inSelectedRegion={isWithinRegion(location, selectedRegion)}
        inSelectedCell={inSelectedCell}
        selectedFrom={
          "selectedFrom" in selectedCell ? selectedCell.selectedFrom : undefined
        }
        isHovered={isAtLocation(this.state.hover, location)}
        item={item}
        key={location.column}
        location={location}
        onAddItem={this.props.onAddItem}
        onMoveItem={this.props.onMoveItem}
        onMouseEnter={(e: React.MouseEvent) => {
          this._handleCellMouseEnter(location, e);
        }}
        onEndDragCell={(newLocation: Location) => {
          this._handleEndDragCell(newLocation);
        }}
        onEmptyCellMouseDown={(e: React.MouseEvent) => {
          this._handleEmptyCellMouseDown(e, location);
        }}
        onReturn={(down = true) => {
          this._onReturn(location, down);
        }}
        onTab={(right = true) => {
          this._onTab(location, right);
        }}
        // ref={`cell-${location.row}-${location.column}`}
        getRowHeight={() => this._getRowHeight(location.row)}
        showAutoFillToken={showAutoFillToken}
      />
    );
  }

  _row(row: number, columnCount: number) {
    return upto(columnCount).map((column) => {
      return this._cell({ row, column });
    });
  }

  _getRowHeight(rowI: number) {
    return _.get(this.refs[`row-${rowI}`], "offsetHeight") as unknown as number;
  }

  componentDidMount() {
    window.recorder.recordMountEvent(this);
  }
  componentWillUpdate() {
    window.recorder.recordRenderStartEvent(this);
  }

  componentDidUpdate() {
    window.recorder.recordRenderStopEvent(this);
  }

  componentWillUnmount() {
    window.recorder.recordUnmountEvent(this);
    this.props.onDeSelectAll();
  }

  render() {
    const { rows, columns } = this._size();
    const { edges } = this.props;
    let className = "FlowGrid";
    className += this.props.showGridLines ? " withLines" : "";
    className += this.props.isModelingCanvas ? " isSelectable" : "";

    return (
      <DndProvider backend={HTML5Backend}>
        <div
          className="FlowGrid-Container"
          onMouseLeave={this._handleMouseLeave.bind(this)}
          onMouseUp={this._handleMouseUp.bind(this)}
          onKeyDown={this._handleKeyDown.bind(this)}
          onKeyUp={this._handleKeyUp.bind(this)}
        >
          <div className={className}>
            <div className="canvas">
              {upto(rows).map((row) => {
                return (
                  <div className="FlowGridRow" key={row} ref={`row-${row}`}>
                    {this._row(row, columns)}
                  </div>
                );
              })}
            </div>
            <BackgroundContainer
              edges={edges}
              rowCount={rows}
              getRowHeight={this._getRowHeight.bind(this)}
              selectedRegion={this.props.selectedRegion}
              copiedRegion={this.props.copiedRegion}
              analyzedRegion={this.props.analyzedRegion}
              autoFillRegion={getBounds(this.state.autoFillRegion)}
            />
          </div>
        </div>
      </DndProvider>
    );
  }
}
