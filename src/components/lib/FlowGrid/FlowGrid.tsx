import React, { useEffect, useMemo, useRef, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { BackgroundContainer } from "./background-container";
import Cell from "./cell";

import { EdgeShape } from "~/components/spaces/SpaceCanvas";
import {
  boundingRegion,
  Direction,
  getBounds,
  isAtLocation,
  isLocation,
  isWithinRegion,
  CanvasLocation,
  MaybeRegion,
} from "~/lib/locationUtils";
import { SelectedCellState } from "~/modules/selected_cell/reducer";
import { CanvasState, GridItem } from "./types";
import { DirectionToLocation, keycodeToDirection } from "./utils";
import clsx from "clsx";

const upto = (n: number): number[] =>
  Array.apply(null, { length: n }).map(Number.call, Number);

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
  onSelectItem(location: CanvasLocation, direction?: any): void;
  onMultipleSelect(corner1: CanvasLocation, corner2: CanvasLocation): void;
  onAutoFillRegion(autoFillRegion: {
    start: CanvasLocation;
    end: CanvasLocation;
  }): void;
  onDeSelectAll(): void;
  onAddItem(location: CanvasLocation): void;
  onMoveItem(arg: { prev: CanvasLocation; next: CanvasLocation }): void;
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
  hover: CanvasLocation;
  dragSelecting?: boolean;
  ctrlPressed?: boolean;
} & (
  | {
      tracingAutoFillRegion: true;
      autoFillRegion: {
        start: CanvasLocation;
        end?: CanvasLocation;
      };
    }
  | {
      tracingAutoFillRegion: false;
      autoFillRegion: {
        start?: CanvasLocation;
        end?: CanvasLocation;
      };
    }
);

// via https://stackoverflow.com/a/53837442
const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
};

const useCallOnUnmount = (fn: () => void) => {
  const ref = useRef<() => void>(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  useEffect(() => {
    // on unmount
    return () => {
      ref.current();
    };
  }, []);
};

export const FlowGrid: React.FC<Props> = ({
  items,
  edges,
  showGridLines = true,
  isModelingCanvas = true,
  onDeSelectAll,
  selectedCell,
  selectedRegion,
  analyzedRegion,
  copiedRegion,
  onPaste,
  onCopy,
  onCut,
  onUndo,
  onRedo,
  onSelectItem,
  onRemoveItems,
  onMultipleSelect,
  onAddItem,
  onMoveItem,
  onAutoFillRegion,
  isItemEmpty,
  canvasState,
  hasItemUpdated,
}) => {
  const forceUpdate = useForceUpdate();

  // We don't store this as state because we don't want this to cause renders.
  const lastMousePosition = useRef({ pageX: 0, pageY: 0 });

  const [state, setState] = useState<State>({
    hover: { row: -1, column: -1 }, // An impossible location means nothing hovered.
    dragSelecting: false,
    ctrlPressed: false,
    tracingAutoFillRegion: false,
    autoFillRegion: {},
  });

  useCallOnUnmount(onDeSelectAll);

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { rows, columns } = useMemo(() => {
    const [, { row: largestRow, column: largestColumn }] = boundingRegion(
      items.map((e) => e.location)
    );
    let [selectedRow, selectedColumn] = [0, 0];
    if (isLocation(selectedCell)) {
      selectedRow = selectedCell.row;
      selectedColumn = selectedCell.column;
    }

    if (isModelingCanvas) {
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
  }, [isModelingCanvas, items, selectedCell]);

  const newAutoFillRegion = (
    start: CanvasLocation,
    location: CanvasLocation
  ) => {
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
  };

  const handleMouseLeave = () => {
    window.recorder.recordNamedEvent("FlowGrid set hover state");
    setState({
      ...state,
      hover: { row: -1, column: -1 },
      dragSelecting: false,
      tracingAutoFillRegion: false,
      autoFillRegion: {},
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 0) {
      window.recorder.recordNamedEvent("FlowGrid set left down state");
      setState({ ...state, dragSelecting: false });
    }
  };

  const handleEmptyCellMouseDown = (e: React.MouseEvent) => {
    if (
      e.button === 0 &&
      !(e.target && (e.target as any).type === "textarea")
    ) {
      window.recorder.recordNamedEvent("FlowGrid set left down state");
      setState({ ...state, dragSelecting: true });
      lastMousePosition.current = { pageX: e.pageX, pageY: e.pageY };
      e.preventDefault();
    }
  };

  const mouseMoved = (e: React.MouseEvent) => {
    const sameLocation =
      e.pageX === lastMousePosition.current.pageX &&
      e.pageY === lastMousePosition.current.pageY;
    return !sameLocation;
  };

  const handleCellMouseEnter = (
    location: CanvasLocation,
    e: React.MouseEvent
  ) => {
    window.recorder.recordNamedEvent("FlowGrid set hover state");
    // If this mouse hasn't moved, or the user is neither tracing a fill region or dragging a selected region, just set
    // the hover state.
    const userDraggingSelection =
      state.tracingAutoFillRegion || state.dragSelecting;
    if (!(mouseMoved(e) && userDraggingSelection)) {
      setState({ ...state, hover: location });
      return;
    }
    const hover: CanvasLocation = { row: -1, column: -1 };

    if (state.tracingAutoFillRegion) {
      window.recorder.recordNamedEvent("FlowGrid set autoFillRegion state");
      const autoFillRegion = newAutoFillRegion(
        state.autoFillRegion.start,
        location
      );
      setState({ ...state, autoFillRegion, hover });
    } else if (state.dragSelecting) {
      handleEndRangeSelect(location);
      setState({ ...state, hover });
    }
  };

  const handleEndDragCell = (location: CanvasLocation) => {
    handleMouseLeave();
    onSelectItem(location);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.keyCode == 17 || e.keyCode == 224 || e.keyCode == 91) {
      window.recorder.recordNamedEvent("FlowGrid set ctrl pressed state");
      setState({ ...state, ctrlPressed: false });
    }
  };

  const selectedItems = useMemo(() => {
    return items.filter((i) => isWithinRegion(i.location, selectedRegion));
  }, [items, selectedRegion]);

  const handleRemoveSelectedItems = () => {
    onRemoveItems(selectedItems.map((i) => i.key));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.target && (e.target as any).type === "textarea") {
      return;
    }
    if (e.keyCode === 8 || e.keyCode === 46) {
      handleRemoveSelectedItems();
      e.preventDefault();
    }

    const direction = keycodeToDirection(e.keyCode);
    if (direction && "row" in selectedCell) {
      e.preventDefault();
      const newLocation = new DirectionToLocation(
        { rows, columns },
        selectedCell
      )[direction]();
      onSelectItem(newLocation);
    } else if (
      !e.shiftKey &&
      (e.keyCode == 17 ||
        e.keyCode == 224 ||
        e.keyCode == 91 ||
        e.keyCode == 93)
    ) {
      e.preventDefault();
      window.recorder.recordNamedEvent("FlowGrid set ctrl pressed state");
      setState({ ...state, ctrlPressed: true });
    } else if (state.ctrlPressed) {
      if (e.keyCode == 86) {
        onPaste?.();
      } else if (e.keyCode == 67) {
        onCopy?.();
      } else if (e.keyCode == 88) {
        onCut?.();
      } else if (e.keyCode == 90 && !e.shiftKey) {
        onUndo();
        e.preventDefault();
      } else if (e.keyCode == 89 || (e.keyCode == 90 && e.shiftKey)) {
        onRedo();
        e.preventDefault();
      }
    }
  };

  const handleEndRangeSelect = (corner1: CanvasLocation) => {
    const corner2 = selectedCell;

    if (!isLocation(corner2)) {
      onSelectItem(corner1);
      return;
    }

    onMultipleSelect(corner1, corner2);
  };

  const addIfNeededAndSelect = (
    location: CanvasLocation,
    direction: Direction
  ) => {
    if (!items.find((i) => isAtLocation(i.location, location))) {
      onAddItem(location);
    }
    onSelectItem(location, direction);
  };

  const handleReturn = (location: CanvasLocation, isDown: boolean) => {
    const { row, column } = location;
    const newRow = isDown ? row + 1 : (row || 1) - 1;
    const newLocation = { row: newRow, column };
    addIfNeededAndSelect(newLocation, isDown ? "UP" : "DOWN");
  };

  const handleTab = (location: CanvasLocation, isRight: boolean) => {
    const { row, column } = location;
    const newCol = isRight ? column + 1 : (column || 1) - 1;
    const newLocation = { row, column: newCol };
    addIfNeededAndSelect(newLocation, isRight ? "LEFT" : "RIGHT");
  };

  const handleAutoFillTargetMouseDown = (location: CanvasLocation) => {
    window.recorder.recordNamedEvent("FlowGrid set autoFillRegion state");
    setState({
      ...state,
      tracingAutoFillRegion: true,
      autoFillRegion: { start: location },
    });
  };

  const onCellMouseUp = () => {
    if (!state.tracingAutoFillRegion) {
      return;
    }
    const { autoFillRegion } = state;
    if (!autoFillRegion.end) {
      return; // huh?
    }
    window.recorder.recordNamedEvent("FlowGrid set autoFillRegion state");
    onAutoFillRegion(
      autoFillRegion as { start: CanvasLocation; end: CanvasLocation } // FIXME
    );

    // FIXME - there might be typing bugs here but this is how it worked pre-typescript
    handleEndRangeSelect(autoFillRegion.end);

    setState({ ...state, tracingAutoFillRegion: false, autoFillRegion: {} });
  };

  const _getRowHeight = (rowI: number) => {
    return rowRefs.current[rowI]?.offsetHeight || 0;
  };

  // TODO(matthew): Look into necessity of 'inSelectedRegion' passed to cell below.
  const renderCell = (location: CanvasLocation) => {
    const item = items.find((i) => isAtLocation(i.location, location));
    const inSelectedCell = isAtLocation(selectedCell, location);
    const selectedRegionNotOneByOne =
      selectedRegion.length === 2 &&
      !isAtLocation(selectedRegion[0], selectedRegion[1]);
    const hasNonEmptyItem = !!item && !isItemEmpty(item.key);
    const showAutoFillToken =
      inSelectedCell &&
      hasNonEmptyItem &&
      !state.dragSelecting &&
      !selectedRegionNotOneByOne;
    return (
      <Cell
        onMouseUp={() => {
          onCellMouseUp();
        }}
        onAutoFillTargetMouseDown={() => {
          handleAutoFillTargetMouseDown(location);
        }}
        canvasState={canvasState}
        forceFlowGridUpdate={forceUpdate}
        gridKeyPress={handleKeyDown}
        hasItemUpdated={hasItemUpdated}
        handleSelect={onSelectItem}
        handleEndRangeSelect={handleEndRangeSelect}
        inSelectedRegion={isWithinRegion(location, selectedRegion)}
        inSelectedCell={inSelectedCell}
        selectedFrom={
          "selectedFrom" in selectedCell ? selectedCell.selectedFrom : undefined
        }
        isHovered={isAtLocation(state.hover, location)}
        item={item}
        key={location.column}
        location={location}
        onAddItem={onAddItem}
        onMoveItem={onMoveItem}
        onMouseEnter={(e: React.MouseEvent) => {
          handleCellMouseEnter(location, e);
        }}
        onEndDragCell={(newLocation: CanvasLocation) => {
          handleEndDragCell(newLocation);
        }}
        onEmptyCellMouseDown={handleEmptyCellMouseDown}
        onReturn={(down = true) => {
          handleReturn(location, down);
        }}
        onTab={(right = true) => {
          handleTab(location, right);
        }}
        // ref={`cell-${location.row}-${location.column}`}
        getRowHeight={() => _getRowHeight(location.row)}
        showAutoFillToken={showAutoFillToken}
      />
    );
  };

  const renderRow = (row: number) => {
    return upto(columns).map((column) => {
      return renderCell({ row, column });
    });
  };

  const className = clsx(
    "FlowGrid",
    showGridLines && "withLines",
    isModelingCanvas && "isSelectable"
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="FlowGrid-Container"
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <div className={className}>
          <div className="canvas">
            {upto(rows).map((row) => {
              return (
                <div
                  className="FlowGridRow"
                  key={row}
                  ref={(el) => (rowRefs.current[row] = el)}
                >
                  {renderRow(row)}
                </div>
              );
            })}
          </div>
          <BackgroundContainer
            edges={edges}
            rowCount={rows}
            getRowHeight={_getRowHeight}
            selectedRegion={selectedRegion}
            copiedRegion={copiedRegion}
            analyzedRegion={analyzedRegion}
            autoFillRegion={getBounds(state.autoFillRegion)}
          />
        </div>
      </div>
    </DndProvider>
  );
};
