import React, { useImperativeHandle, useRef } from "react";
import { CanvasLocation } from "~/lib/locationUtils";

type Props = {
  onAddItem(location: CanvasLocation): void;
  inSelectedCell: boolean;
  gridKeyPress(e: React.KeyboardEvent): void;
  location: CanvasLocation;
};

export const EmptyCell = React.memo(
  React.forwardRef<{ focus(): void }, Props>(function EmptyCell(props, ref) {
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
        className="FlowGridEmptyCell"
        onKeyPress={props.gridKeyPress}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={divRef}
      />
    );
  }),
  () => true // never re-render; TODO - is this safe?
);
