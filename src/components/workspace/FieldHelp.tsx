import { ReactNode, useId, useState } from "react";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { Icon } from "./Icon";
import styles from "./workspace.module.css";

export function FieldHelp({
  children,
  label = "Help with values and formulas",
}: {
  children: ReactNode;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const { x, y, strategy, refs, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-end",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 12 })],
  });
  const hover = useHover(context, {
    mouseOnly: true,
    delay: { open: 150, close: 100 },
    handleClose: safePolygon(),
  });
  const focus = useFocus(context);
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    click,
    dismiss,
  ]);
  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        className={styles.fieldHelpButton}
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        {...getReferenceProps({
          onKeyDown(event) {
            if (event.key === "Escape" && open) {
              event.stopPropagation();
              // Cancel delayed hover/focus work as well as closing the popover.
              context.events.emit("dismiss", {
                type: "escapeKey",
                data: { returnFocus: false },
              });
              setOpen(false);
            }
          },
        })}
      >
        <Icon name="help" />
      </button>
      {open && (
        <FloatingPortal
          root={
            refs.domReference.current?.closest<HTMLElement>(
              '[role="dialog"]'
            ) || undefined
          }
        >
          <div
            ref={refs.setFloating}
            id={id}
            role="tooltip"
            className={styles.fieldHelpPopover}
            style={{ position: strategy, left: x ?? 0, top: y ?? 0 }}
            {...getFloatingProps()}
          >
            {children}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
