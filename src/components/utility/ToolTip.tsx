import React, { useRef, useState } from "react";

import {
  arrow,
  flip,
  FloatingPortal,
  offset,
  Placement,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import clsx from "clsx";

export const ToolTip: React.FC<
  {
    children: React.ReactNode;
    id?: string;
    disabled?: boolean;
    theme?: "dark" | "light";
    withPortal?: boolean;
    containerClassName?: string;
    placement?: Placement;
  } & (
    | {
        text: string;
        render?: undefined;
      }
    | { render(): React.ReactNode; text?: undefined }
  )
> = ({
  children,
  id,
  disabled = false,
  theme = "dark",
  withPortal = false,
  containerClassName = "",
  placement: suggestedPlacement,
  text,
  render,
}) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  const { x, y, strategy, placement, refs, context, middlewareData } =
    useFloating({
      open: open && !disabled,
      onOpenChange: setOpen,
      placement: suggestedPlacement,
      middleware: [offset(4), flip(), arrow({ element: arrowRef })],
    });

  const hover = useHover(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[placement.split("-")[0]];

  const renderTooltip = () => (
    <div
      ref={refs.setFloating}
      className={clsx(
        "rounded-sm px-3 py-2 z-10",
        text !== undefined && "text-sm",
        theme === "dark" ? "bg-dark-2 text-white" : "bg-white"
      )}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
      {...getFloatingProps()}
    >
      {text ?? render()}
      <div
        ref={arrowRef}
        style={{
          left: middlewareData.arrow?.x ?? "",
          top: middlewareData.arrow?.y ?? "",
          [staticSide!]: "-0.25rem",
        }}
        className={clsx(
          "absolute w-2 h-2 rotate-45",
          theme === "dark" ? "bg-dark-2" : "bg-white"
        )}
      />
    </div>
  );

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={containerClassName}
        aria-describedBy={id}
      >
        {children}
        {open &&
          !disabled &&
          (withPortal ? (
            <FloatingPortal>{renderTooltip()}</FloatingPortal>
          ) : (
            renderTooltip()
          ))}
      </div>
    </>
  );
};
