import React, { useEffect, useMemo, useRef, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { BackgroundContainer } from "./BackgroundContainer";
import { DropCell } from "./DropCell";

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
import { GridItem } from "./types";
import { DirectionToLocation, keycodeToDirection } from "./utils";
import clsx from "clsx";
import { CanvasState } from "~/modules/canvas_state/slice";

const upto = (n: number): number[] => new Array(n).fill(0).map((_, i) => i);

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
  size?: "small" | "normal";
};

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
  size,
}) => {
  const forceUpdate = useForceUpdate();

  // We don't store this as state because we don't want this to cause renders.
  const lastMousePosition = useRef({ pageX: 0, pageY: 0 });

  const [hover, setHover] = useState<CanvasLocation | undefined>(undefined);
  const [dragSelecting, setDragSelecting] = useState(false);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [autoFillRegion, setAutoFillRegion] = useState<
    { start: CanvasLocation; end?: CanvasLocation } | undefined
  >(undefined);

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

  const handleMouseLeave = () => {
    setHover(undefined);
    setDragSelecting(false);
    setAutoFillRegion(undefined);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setDragSelecting(false);
    }
  };

  const handleEmptyCellMouseDown = (e: React.MouseEvent) => {
    if (
      e.button === 0 &&
      !(e.target && (e.target as any).type === "textarea")
    ) {
      setDragSelecting(true);
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

  const handleCellMouseEnter = (
    location: CanvasLocation,
    e: React.MouseEvent
  ) => {
    // If this mouse hasn't moved, or the user is neither tracing a fill region or dragging a selected region, just set
    // the hover state.
    const userDraggingSelection = Boolean(autoFillRegion || dragSelecting);
    if (!(mouseMoved(e) && userDraggingSelection)) {
      setHover(location);
      return;
    }

    setHover(undefined);

    if (autoFillRegion) {
      setAutoFillRegion(newAutoFillRegion(autoFillRegion.start, location));
    } else if (dragSelecting) {
      handleEndRangeSelect(location);
    }
  };

  const handleCellMouseUp = () => {
    if (!autoFillRegion?.end) {
      return; // huh?
    }
    onAutoFillRegion(
      autoFillRegion as { start: CanvasLocation; end: CanvasLocation } // FIXME
    );

    // FIXME - there might be typing bugs here but this is how it worked pre-typescript
    handleEndRangeSelect(autoFillRegion.end);

    setAutoFillRegion(undefined);
  };

  const handleEndDragCell = (location: CanvasLocation) => {
    handleMouseLeave();
    onSelectItem(location);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.keyCode == 17 || e.keyCode == 224 || e.keyCode == 91) {
      setCtrlPressed(false);
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
      setCtrlPressed(true);
    } else if (ctrlPressed) {
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
    setAutoFillRegion({ start: location });
  };

  const getRowHeight = (rowI: number) => {
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
      !dragSelecting &&
      !selectedRegionNotOneByOne;
    return (
      <DropCell
        onMouseUp={handleCellMouseUp}
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
        isHovered={Boolean(hover && isAtLocation(hover, location))}
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
        getRowHeight={() => getRowHeight(location.row)}
        showAutoFillToken={showAutoFillToken}
        size={size}
      />
    );
  };

  const className = clsx(
    "FlowGrid",
    showGridLines && "withLines",
    isModelingCanvas && "isSelectable"
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="FlowGrid-Container overflow-hidden"
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
                  {upto(columns).map((column) => {
                    return renderCell({ row, column });
                  })}
                </div>
              );
            })}
          </div>
          <BackgroundContainer
            edges={edges}
            rowCount={rows}
            getRowHeight={getRowHeight}
            selectedRegion={selectedRegion}
            copiedRegion={copiedRegion}
            analyzedRegion={analyzedRegion}
            autoFillRegion={getBounds(autoFillRegion)}
          />
        </div>
      </div>
    </DndProvider>
  );
};
