import React, { Component, CSSProperties, useEffect } from "react";

import { ConnectDragSource, useDrag, useDragLayer, XYCoord } from "react-dnd";

import { CanvasLocation } from "~/lib/locationUtils";

import { getClassName } from "~/lib/engine/utils";
import { getEmptyImage } from "react-dnd-html5-backend";
import { GridItem } from "./types";

export type GridContext = {
  hovered: boolean;
  inSelectedCell: boolean;
  selectedFrom?: any;
  gridKeyPress(e: React.SyntheticEvent): void;
  connectDragSource: ConnectDragSource;
  forceFlowGridUpdate(): void;
  onReturn(): void;
  onTab(): void;
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

type CollectedProps = {
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
};

type OuterProps = {
  hover: boolean;
  gridKeyPress(e: React.SyntheticEvent): void;
  forceFlowGridUpdate(): void;
  onTab(): void;
  onReturn(): void;
  inSelectedCell: boolean;
  selectedFrom?: any;
  item: GridItem;
  getRowHeight(): number;
  location: CanvasLocation;
  handleSelect(location: CanvasLocation, direction?: any): void;
  onMoveItem(arg: { prev: CanvasLocation; next: CanvasLocation }): void;
  onEndDrag(location: CanvasLocation): void;
};

type State = {
  width: number;
};

type Props = CollectedProps & OuterProps;

export class InnerItemCell extends Component<Props, State> {
  containerRef: React.RefObject<HTMLDivElement>;

  state = {
    width: 0,
  };

  constructor(props: Props) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentWillReceiveProps(newProps: Props) {
    const startedDragging = !this.props.isDragging && newProps.isDragging;
    const childItem =
      this.containerRef && this.containerRef.current!.children[0];

    if (startedDragging && childItem) {
      this.setState({ width: (childItem as any).offsetWidth });
    }
  }

  onMouseUp(e: React.MouseEvent) {
    if (
      e.button === 0 &&
      (e.target as any).className === "FlowGridFilledCell"
    ) {
      this.focus();
    }
  }

  focus() {
    this.containerRef.current?.focus();
  }

  render() {
    const className = getClassName(
      "FlowGridFilledCell",
      this.props.isDragging ? "isDragging" : null
    );

    // This forces dragging cells to not change their row heights. A bit hacky, but gives a better user experience in my
    // opinion and keeps background layer in sync with real row heights during drag (which skips normal rendering tree).
    const styles = this.props.isDragging
      ? { minHeight: `${this.props.getRowHeight() - 1}px` }
      : {};

    const item = this.props.item.component({
      hovered: this.props.hover,
      inSelectedCell: this.props.inSelectedCell,
      selectedFrom: this.props.selectedFrom,
      gridKeyPress: this.props.gridKeyPress,
      connectDragSource: this.props.connectDragSource,
      forceFlowGridUpdate: this.props.forceFlowGridUpdate,
      onReturn: this.props.onReturn,
      onTab: this.props.onTab,
    });

    return (
      <div
        className={className}
        style={styles}
        onMouseUp={this.onMouseUp.bind(this)}
        ref={this.containerRef}
        tabIndex={-1}
      >
        {this.props.isDragging ? (
          <DragPreview width={this.state.width}>{item}</DragPreview>
        ) : (
          item
        )}
      </div>
    );
  }
}

const DragItemCell = React.forwardRef<InnerItemCell, OuterProps>(
  (props, ref) => {
    const [collectedProps, drag, dragPreview] = useDrag<
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

    // hide default drag preview, we use useDragLayer instead
    useEffect(() => {
      dragPreview(getEmptyImage());
    }, []);

    return (
      <InnerItemCell
        {...props}
        {...collectedProps}
        ref={ref}
        connectDragSource={drag}
      />
    );
  }
);

export default DragItemCell;
