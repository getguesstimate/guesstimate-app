import React, {
  createContext,
  FC,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import clsx from "clsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCallOnUnmount, useForceUpdate } from "~/components/utility/hooks";
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
import { SelectedCell } from "~/modules/selectedCell/reducer";

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
  // main props
  items: GridItem[];
  edges?: EdgeShape[]; // if not defined, cells won't have additional padding, so [] and `undefined` are different
  // other controlled state - managed in Redux (but shoudn't)
  selectedCell: SelectedCell;
  selectedRegion: MaybeRegion;
  copiedRegion: MaybeRegion;
  analyzedRegion: MaybeRegion;
  // customize visual styles
  size?: FlowGridSize;
  showGridLines: boolean;
  isModelingCanvas?: boolean;
  // actions that act on props
  onSelectItem(location: CanvasLocation, direction?: Direction): void;
  onMultipleSelect(corner1: CanvasLocation, corner2: CanvasLocation): void;
  onDeSelectAll(): void;
  onAutoFillRegion(autoFillRegion: {
    start: CanvasLocation;
    end: CanvasLocation;
  }): void;
  onAddItem(location: CanvasLocation): void;
  onMoveItem(arg: { prev: CanvasLocation; next: CanvasLocation }): void;
  onRemoveItems(ids: string[]): void;
};

type FlowGridContextShape = {
  size: FlowGridSize;
  showGridLines: boolean;
  isModelingCanvas: boolean;
  showEdges: boolean;
};

export const FlowGridContext = createContext<FlowGridContextShape>({
  size: "normal",
  showGridLines: true,
  isModelingCanvas: true,
  showEdges: true,
});

export const FlowGrid: FC<Props> = ({
  items,
  edges,
  selectedCell,
  selectedRegion,
  analyzedRegion,
  copiedRegion,
  size = "normal",
  showGridLines = true,
  isModelingCanvas = true,
  onDeSelectAll,
  onSelectItem,
  onRemoveItems,
  onMultipleSelect,
  onAddItem,
  onMoveItem,
  onAutoFillRegion,
}) => {
  const forceUpdate = useForceUpdate();

  const [hover, setHover] = useState<CanvasLocation | undefined>(undefined);
  const [dragSelecting, setDragSelecting] = useState(false);
  const [autoFillRegion, setAutoFillRegion] = useState<
    { start: CanvasLocation; end?: CanvasLocation } | undefined
  >(undefined);

  useCallOnUnmount(onDeSelectAll);

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

    if (autoFillRegion?.end) {
      onAutoFillRegion(
        autoFillRegion as { start: CanvasLocation; end: CanvasLocation } // FIXME
      );

      // FIXME - there might be typing bugs here but this is how it worked pre-typescript
      handleEndRangeSelect(autoFillRegion.end);

      setAutoFillRegion(undefined);
    }
  };

  const handleEmptyCellMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setDragSelecting(true);
      e.preventDefault();
    }
  }, []);

  const handleEndDragCell = useCallback(
    (location: CanvasLocation) => {
      handleMouseLeave();
      onSelectItem(location);
    },
    [onSelectItem]
  );

  const selectedItems = useMemo(() => {
    return items.filter((item) =>
      isWithinRegion(item.location, selectedRegion)
    );
  }, [items, selectedRegion]);

  const handleRemoveSelectedItems = () => {
    onRemoveItems(selectedItems.map((item) => item.key));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
    }
  };

  const handleEndRangeSelect = useCallback(
    (corner1: CanvasLocation) => {
      const corner2 = selectedCell;

      if (!isLocation(corner2)) {
        onSelectItem(corner1);
        return;
      }

      onMultipleSelect(corner1, corner2);
    },
    [
      onMultipleSelect,
      onSelectItem,
      selectedCell, // FIXME - this will cause all `<DropCell>` to re-render on selection changes
    ]
  );

  const handleCellMouseEnter = useCallback(
    (location: CanvasLocation) => {
      if (autoFillRegion) {
        setHover(undefined);
        setAutoFillRegion(newAutoFillRegion(autoFillRegion.start, location));
      } else if (dragSelecting) {
        setHover(undefined);
        handleEndRangeSelect(location);
      } else {
        // If the user is neither tracing a fill region nor dragging a selected
        // region, just set the hover state.
        setHover(location);
      }
    },
    [autoFillRegion, dragSelecting, handleEndRangeSelect]
  );

  const addIfNeededAndSelect = useCallback(
    (location: CanvasLocation, direction: Direction) => {
      if (!items.find((item) => isAtLocation(item.location, location))) {
        onAddItem(location);
      }
      onSelectItem(location, direction);
    },
    [items, onAddItem, onSelectItem]
  );

  const handleReturn = useCallback(
    (location: CanvasLocation, isDown: boolean) => {
      const newLocation: CanvasLocation = {
        row: isDown ? location.row + 1 : (location.row || 1) - 1,
        column: location.column,
      };
      addIfNeededAndSelect(newLocation, isDown ? "UP" : "DOWN");
    },
    [addIfNeededAndSelect]
  );

  const handleTab = useCallback(
    (location: CanvasLocation, isRight: boolean) => {
      const newLocation: CanvasLocation = {
        row: location.row,
        column: isRight ? location.column + 1 : (location.column || 1) - 1,
      };
      addIfNeededAndSelect(newLocation, isRight ? "LEFT" : "RIGHT");
    },
    [addIfNeededAndSelect]
  );

  const handleAutoFillTargetMouseDown = useCallback(
    (location: CanvasLocation) => {
      setAutoFillRegion({ start: location });
    },
    []
  );

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // TODO - useCallback
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
        row={location.row}
        column={location.column}
        item={item}
        isHovered={Boolean(hover && isAtLocation(hover, location))}
        inSelectedCell={inSelectedCell}
        selectedFrom={
          "selectedFrom" in selectedCell ? selectedCell.selectedFrom : undefined
        }
        showAutoFillToken={showAutoFillToken}
        onAddItem={onAddItem}
        onMoveItem={onMoveItem}
        onSelect={onSelectItem}
        onEndRangeSelect={handleEndRangeSelect}
        onEndDragCell={handleEndDragCell}
        onMouseEnter={handleCellMouseEnter}
        onEmptyCellMouseDown={handleEmptyCellMouseDown}
        onAutoFillTargetMouseDown={handleAutoFillTargetMouseDown}
        onReturn={handleReturn}
        onTab={handleTab}
        forceFlowGridUpdate={forceUpdate}
        getRowHeight={getRowHeight}
      />
    );
  };

  const contextValue = useMemo(() => {
    return {
      size,
      showGridLines,
      isModelingCanvas,
      showEdges: edges !== undefined,
    };
  }, [edges, isModelingCanvas, showGridLines, size]);

  const autofillRegionAsRegion = useMemo(
    () => getBounds(autoFillRegion),
    [autoFillRegion]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <FlowGridContext.Provider value={contextValue}>
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
            autoFillRegion={autofillRegionAsRegion}
          />
        </div>
      </FlowGridContext.Provider>
    </DndProvider>
  );
};
