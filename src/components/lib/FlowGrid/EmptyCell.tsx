import React, {
  forwardRef,
  memo,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";

import clsx from "clsx";
import { CanvasLocation } from "~/lib/locationUtils";

import { FlowGridContext } from "./FlowGrid";

type Props = {
  onAddItem(location: CanvasLocation): void;
  inSelectedCell: boolean;
  gridKeyPress(e: React.KeyboardEvent): void;
  location: CanvasLocation;
  isOver?: boolean;
  isHovered: boolean;
};

export const EmptyCell = memo(
  forwardRef<{ focus(): void }, Props>(function EmptyCell(props, ref) {
    const { isModelingCanvas } = useContext(FlowGridContext);
    const divRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({
      focus() {
        divRef.current?.focus();
      },
    }));

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && props.inSelectedCell) {
        props.onAddItem(props.location);
        e.preventDefault();
      }
      if (e.key === "Backspace") {
        e.preventDefault();
      }
    };

    return (
      <div
        className={clsx(
          isModelingCanvas && "cursor-pointer",
          isModelingCanvas && props.isHovered && "bg-[rgb(79,152,197)]/[0.25]",
          "focus:outline-none",
          props.isOver && "bg-[rgb(127,149,160)]/[0.81] transition-colors"
        )}
        onKeyPress={props.gridKeyPress}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={divRef}
      />
    );
  })
);
