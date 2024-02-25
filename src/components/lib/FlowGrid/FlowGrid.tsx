import React, { createContext, FC, useMemo, useRef, useState } from "react";

import clsx from "clsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCallOnUnmount, useForceUpdate } from "~/components/utility/hooks";
import { isMac } from "~/components/utility/isMac";
import {
  boundingRegion,
  CanvasLocation,
  Direction,
  getBounds,
  isAtLocation,
  isLocation,
  isWithinRegion,
  MaybeRegion,
} from "~/lib/locationUtils";
import { CanvasState } from "~/modules/canvas_state/slice";
import { SelectedCell } from "~/modules/selected_cell/reducer";

import { BackgroundContainer } from "./BackgroundContainer";
import { DropCell } from "./DropCell";
import { EdgeShape } from "./Edges";
import { GridItem } from "./types";
import { DirectionToLocation, keycodeToDirection } from "./utils";

const upto = (n: number): number[] => new Array(n).fill(0).map((_, i) => i);

type FlowGridSize = "small" | "normal";

export const cellSizeInfo: Record<
  FlowGridSize,
  { classNames: string; width: number }
> = {
  small: {
    classNames: "w-[150px] max-w-[150px]", // must be spelled out because of tailwind JIT
    width: 150,
  },
  normal: {
    classNames: "w-[210px] max-w-[210px]",
    width: 210,
  },
};

function newAutoFillRegion(start: CanvasLocation, location: CanvasLocation) {
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

type Props = {
  canvasState: CanvasState;
  onUndo(): void;
  onRedo(): void;
  items: GridItem[];
  edges?: EdgeShape[]; // if not defined, cells won't have additional padding, so [] and `undefined` are different
  selectedCell: SelectedCell;
  selectedRegion: MaybeRegion;
  copiedRegion: MaybeRegion;
  analyzedRegion: MaybeRegion;
  onSelectItem(location: CanvasLocation, direction?: Direction): void;
  onMultipleSelect(corner1: CanvasLocation, corner2: CanvasLocation): void;
  onAutoFillRegion(autoFillRegion: {
    start: CanvasLocation;
    end: CanvasLocation;
  }): void;
  onDeSelectAll(): void;
  onAddItem(location: CanvasLocation): void;
  onMoveItem(arg: { prev: CanvasLocation; next: CanvasLocation }): void;
  showGridLines: boolean;
  isModelingCanvas?: boolean;
  onRemoveItems(ids: string[]): void;
  onCut?(): void;
  onCopy?(): void;
  onPaste?(): void;
  size?: FlowGridSize;
};

type FlowGridContextShape = {
  size: FlowGridSize;
  showGridLines: boolean;
  showEdges: boolean;
  isModelingCanvas: boolean;
};

export const FlowGridContext = createContext<FlowGridContextShape>({
  size: "normal",
  showGridLines: true,
  showEdges: true,
  isModelingCanvas: true,
});

export const FlowGrid: FC<Props> = ({
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
  canvasState,
  size = "normal",
}) => {
  const forceUpdate = useForceUpdate();

  const [hover, setHover] = useState<CanvasLocation | undefined>(undefined);
  const [dragSelecting, setDragSelecting] = useState(false);
  const [autoFillRegion, setAutoFillRegion] = useState<
    { start: CanvasLocation; end?: CanvasLocation } | undefined
  >(undefined);

  useCallOnUnmount(onDeSelectAll);

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { rows, columns } = useMemo(() => {
    const { row: largestRow, column: largestColumn } = boundingRegion(
      items.map((e) => e.location)
    )[1];
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
    if (e.button === 0) {
      setDragSelecting(true);
      e.preventDefault();
    }
  };

  const handleCellMouseEnter = (
    location: CanvasLocation,
    e: React.MouseEvent
  ) => {
    // If this the user is neither tracing a fill region nor dragging a selected region, just set
    // the hover state.
    const userDraggingSelection = Boolean(autoFillRegion || dragSelecting);
    if (!userDraggingSelection) {
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

  const selectedItems = useMemo(() => {
    return items.filter((item) =>
      isWithinRegion(item.location, selectedRegion)
    );
  }, [items, selectedRegion]);

  const handleRemoveSelectedItems = () => {
    onRemoveItems(selectedItems.map((item) => item.key));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.target && (e.target as any).type === "textarea") {
      return;
    }
    if (e.key === "Backspace" || e.key === "Delete") {
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
    } else if (e.ctrlKey || (isMac() && e.metaKey)) {
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
    if (!items.find((item) => isAtLocation(item.location, location))) {
      onAddItem(location);
    }
    onSelectItem(location, direction);
  };

  const handleReturn = (location: CanvasLocation, isDown: boolean) => {
    const newLocation: CanvasLocation = {
      row: isDown ? location.row + 1 : (location.row || 1) - 1,
      column: location.column,
    };
    addIfNeededAndSelect(newLocation, isDown ? "UP" : "DOWN");
  };

  const handleTab = (location: CanvasLocation, isRight: boolean) => {
    const newLocation: CanvasLocation = {
      row: location.row,
      column: isRight ? location.column + 1 : (location.column || 1) - 1,
    };
    addIfNeededAndSelect(newLocation, isRight ? "LEFT" : "RIGHT");
  };

  const handleAutoFillTargetMouseDown = (location: CanvasLocation) => {
    setAutoFillRegion({ start: location });
  };

  const getRowHeight = (rowI: number) => {
    // note: offsetHeight won't be as precise, it's rounded to integer value
    return rowRefs.current[rowI]?.getBoundingClientRect().height || 0;
  };

  const renderCell = (location: CanvasLocation) => {
    const item = items.find((item) => isAtLocation(item.location, location));
    const inSelectedCell = isAtLocation(selectedCell, location);
    const singleCellSelected =
      selectedRegion.length === 2 &&
      isAtLocation(selectedRegion[0], selectedRegion[1]);
    const showAutoFillToken =
      !!item &&
      !item.isEmpty &&
      !dragSelecting &&
      inSelectedCell &&
      singleCellSelected;

    return (
      <DropCell
        key={location.column}
        location={location}
        item={item}
        onMouseUp={handleCellMouseUp}
        onAutoFillTargetMouseDown={() =>
          handleAutoFillTargetMouseDown(location)
        }
        canvasState={canvasState}
        forceFlowGridUpdate={forceUpdate}
        gridKeyPress={handleKeyDown}
        handleSelect={onSelectItem}
        handleEndRangeSelect={handleEndRangeSelect}
        inSelectedCell={inSelectedCell}
        selectedFrom={
          "selectedFrom" in selectedCell ? selectedCell.selectedFrom : undefined
        }
        isHovered={Boolean(hover && isAtLocation(hover, location))}
        onAddItem={onAddItem}
        onMoveItem={onMoveItem}
        onMouseEnter={(e: React.MouseEvent) => {
          handleCellMouseEnter(location, e);
        }}
        onEndDragCell={handleEndDragCell}
        onEmptyCellMouseDown={handleEmptyCellMouseDown}
        onReturn={(down = true) => handleReturn(location, down)}
        onTab={(right = true) => handleTab(location, right)}
        getRowHeight={() => getRowHeight(location.row)}
        showAutoFillToken={showAutoFillToken}
      />
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <FlowGridContext.Provider
        value={{
          size,
          showGridLines,
          showEdges: edges !== undefined,
          isModelingCanvas,
        }}
      >
        <div
          className={clsx(
            "relative z-0",
            "ml-px" // fit copied borders
          )}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onKeyDown={handleKeyDown}
        >
          <div className="relative z-10">
            {upto(rows).map((row) => (
              <div
                key={row}
                ref={(el) => (rowRefs.current[row] = el)}
                className="flex"
              >
                {upto(columns).map((column) => renderCell({ row, column }))}
              </div>
            ))}
          </div>
          <BackgroundContainer
            edges={edges || []}
            rowCount={rows}
            getRowHeight={getRowHeight}
            selectedRegion={selectedRegion}
            copiedRegion={copiedRegion}
            analyzedRegion={analyzedRegion}
            autoFillRegion={getBounds(autoFillRegion)}
          />
        </div>
      </FlowGridContext.Provider>
    </DndProvider>
  );
};
