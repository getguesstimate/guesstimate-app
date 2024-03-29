import {
  CSSProperties,
  FC,
  forwardRef,
  memo,
  PropsWithChildren,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import clsx from "clsx";
import { ConnectDragSource, useDrag, useDragLayer, XYCoord } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { CanvasLocation, Direction } from "~/lib/locationUtils";

import { FlowGridContext } from "./FlowGrid";
import { GridItem } from "./types";

export type GridContext = {
  hovered: boolean;
  inSelectedCell: boolean;
  selectedFrom?: Direction;
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
  return { transform: `translate(${x}px, ${y}px)` };
}

const DragPreview: FC<PropsWithChildren<{ width: number }>> = ({
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
  item: GridItem;
  location: CanvasLocation;
  isHovered: boolean;
  inSelectedCell: boolean;
  selectedFrom?: Direction;
  onMoveItem(arg: { prev: CanvasLocation; next: CanvasLocation }): void;
  onEndDrag(location: CanvasLocation): void;
  onReturn(): void;
  onTab(): void;
  forceFlowGridUpdate(): void;
};

export const FilledCell = memo(
  forwardRef<{ focus(): void }, Props>(function FilledCell(props, ref) {
    const { isModelingCanvas, showEdges } = useContext(FlowGridContext);

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
        item: () => ({ location: props.location }),
        end: (_, monitor) => {
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
        collect: (monitor) => {
          return {
            isDragging: monitor.isDragging(),
          };
        },
      }),
      [props.location]
    );

    // hide default drag preview, we use useDragLayer instead
    useEffect(() => {
      dragPreview(getEmptyImage());
    }, []);

    const sizeRef = useRef<[number, number]>([0, 0]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // proxy focus() method upwards
    const itemRef = useRef<{ focus(): void } | null>(null);
    const focus = () => {
      itemRef.current?.focus();
    };
    useImperativeHandle(ref, () => ({
      focus,
    }));

    useEffect(() => {
      const el = containerRef.current;
      if (!isDragging && el) {
        sizeRef.current = [(el as any).offsetWidth, (el as any).offsetHeight];
      }
    });

    // This forces the original cell's row not to change its height. It gives a
    // better user experience and keeps background layer in sync with real row
    // heights during drag (which skips normal rendering tree).
    const styles = isDragging
      ? { width: sizeRef.current[0], height: sizeRef.current[1] }
      : {};

    const item = props.item.render({
      hovered: props.isHovered,
      inSelectedCell: props.inSelectedCell,
      selectedFrom: props.selectedFrom,
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
        ref={containerRef}
        tabIndex={-1}
      >
        {isDragging ? (
          <DragPreview width={sizeRef.current[0]}>{item}</DragPreview>
        ) : (
          item
        )}
      </div>
    );
  })
);
