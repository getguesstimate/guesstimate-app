import React, {
  CSSProperties,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { ConnectDragSource, useDrag, useDragLayer, XYCoord } from "react-dnd";

import { CanvasLocation, Direction } from "~/lib/locationUtils";

import clsx from "clsx";
import { getEmptyImage } from "react-dnd-html5-backend";
import { GridItem } from "./types";
import { FlowGridContext } from "./FlowGrid";

export type GridContext = {
  hovered: boolean;
  inSelectedCell: boolean;
  selectedFrom?: Direction;
  gridKeyPress(e: React.SyntheticEvent): void;
  connectDragSource: ConnectDragSource;
  forceFlowGridUpdate(): void;
  onReturn(): void;
  onTab(): void;
  ref?: { current: { focus(): void } | null };
};

const layerStyles: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 10000,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

function getItemStyles(currentOffset: XYCoord | null) {
  if (!currentOffset) {
    return { display: "none" };
  }

  const x = currentOffset.x;
  const y = currentOffset.y;
  const transform = `translate(${x}px, ${y}px)`;
  return { transform: transform, WebkitTransform: transform };
}

const DragPreview: React.FC<{ width: number; children: React.ReactNode }> = ({
  width,
  children,
}) => {
  const { itemType, currentOffset, isDragging } = useDragLayer((monitor) => ({
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));
  const renderItem = () => {
    const styles = {
      marginTop: "-26px",
      width: `${width}px`,
    };
    switch (itemType) {
      case "card":
        return <div style={styles}>{children}</div>;
    }
  };

  if (!isDragging) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(currentOffset)}>{renderItem()}</div>
    </div>
  );
};

type Props = {
  isHovered: boolean;
  gridKeyPress(e: React.SyntheticEvent): void;
  forceFlowGridUpdate(): void;
  onTab(): void;
  onReturn(): void;
  inSelectedCell: boolean;
  selectedFrom?: Direction;
  item: GridItem;
  getRowHeight(): number;
  location: CanvasLocation;
  handleSelect(location: CanvasLocation, direction?: any): void;
  onMoveItem(arg: { prev: CanvasLocation; next: CanvasLocation }): void;
  onEndDrag(location: CanvasLocation): void;
  focusCell(): void;
};

export const FilledCell = React.forwardRef<{ focus(): void }, Props>(
  function FilledCell(props, ref) {
    const { isModelingCanvas } = useContext(FlowGridContext);

    const [{ isDragging }, drag, dragPreview] = useDrag<
      { location: CanvasLocation },
      {
        location: CanvasLocation;
        item: GridItem;
      },
      { isDragging: boolean }
    >(
      () => ({
        type: "card",
        item() {
          return { location: props.location };
        },
        end(_, monitor) {
          if (!monitor.didDrop()) {
            return;
          }

          const dropResult = monitor.getDropResult();
          if (!dropResult || dropResult.item) {
            return;
          }
          const startLocation = monitor.getItem().location;
          const dropLocation = dropResult.location;
          props.onMoveItem({ prev: startLocation, next: dropLocation });
          props.onEndDrag(dropLocation);
        },
        collect(monitor) {
          return {
            isDragging: monitor.isDragging(),
          };
        },
      }),
      [props.location]
    );

    const { showEdges } = useContext(FlowGridContext);

    const itemRef = useRef<{ focus(): void } | null>(null);

    // hide default drag preview, we use useDragLayer instead
    useEffect(() => {
      dragPreview(getEmptyImage());
    }, []);

    const widthRef = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const focus = () => {
      itemRef.current?.focus();
    };

    useImperativeHandle(ref, () => ({
      focus,
    }));

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
      if (
        e.button === 0 &&
        (e.target as any).className === "FlowGridFilledCell"
      ) {
        focus();
      }
    };

    useEffect(() => {
      const childItem = containerRef.current?.children[0];
      if (!isDragging && childItem) {
        widthRef.current = (childItem as any).offsetWidth;
      }
    });

    // This forces dragging cells to not change their row heights. A bit hacky, but gives a better user experience in my
    // opinion and keeps background layer in sync with real row heights during drag (which skips normal rendering tree).
    const styles = isDragging
      ? { minHeight: `${props.getRowHeight() - 1}px` }
      : {};

    const item = props.item.component({
      hovered: props.isHovered,
      inSelectedCell: props.inSelectedCell,
      selectedFrom: props.selectedFrom,
      gridKeyPress: props.gridKeyPress,
      connectDragSource: drag,
      forceFlowGridUpdate: props.forceFlowGridUpdate,
      onReturn: props.onReturn,
      onTab: props.onTab,
      ref: itemRef,
    });

    return (
      <div
        className={clsx(
          isModelingCanvas && props.isHovered && "bg-[rgba(75,138,177)]/[0.3]",
          "grid place-items-stretch rounded-xs",
          showEdges ? "p-2" : "p-[3px]"
        )}
        style={styles}
        onMouseUp={handleMouseUp}
        ref={containerRef}
        tabIndex={-1}
      >
        {isDragging ? (
          <DragPreview width={widthRef.current}>{item}</DragPreview>
        ) : (
          item
        )}
      </div>
    );
  }
);
